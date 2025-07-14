-- Create badges table for available achievements
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- lucide icon name
  color TEXT NOT NULL DEFAULT 'primary', -- badge color theme
  points_required INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general', -- general, subject, streak, special
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_scores table for tracking points and levels
CREATE TABLE public.user_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  chapters_completed INTEGER NOT NULL DEFAULT 0,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  perfect_scores INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table for awarded badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create point_transactions table for tracking point history
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT, -- chapter_id, quiz_id, etc.
  reference_type TEXT, -- 'chapter_completion', 'quiz_score', 'streak_bonus', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for badges (public read)
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- Create policies for user_scores
CREATE POLICY "Users can view all scores for leaderboard" 
ON public.user_scores 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own scores" 
ON public.user_scores 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" 
ON public.user_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for user_badges
CREATE POLICY "Users can view all badges for comparison" 
ON public.user_badges 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for point_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.point_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.point_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on user_scores
CREATE TRIGGER update_user_scores_updated_at
  BEFORE UPDATE ON public.user_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, color, points_required, category, rarity) VALUES
-- General achievements
('First Steps', 'Complete your first chapter', 'trophy', 'primary', 0, 'general', 'common'),
('Scholar', 'Complete 10 chapters', 'graduation-cap', 'primary', 100, 'general', 'common'),
('Dedicated Learner', 'Complete 25 chapters', 'book-open', 'primary', 250, 'general', 'rare'),
('Academic Master', 'Complete 50 chapters', 'crown', 'primary', 500, 'general', 'epic'),

-- Quiz achievements
('Quiz Novice', 'Complete your first quiz', 'help-circle', 'secondary', 0, 'quiz', 'common'),
('Perfect Score', 'Get 100% on a quiz', 'star', 'yellow', 20, 'quiz', 'common'),
('Quiz Master', 'Get perfect scores on 10 quizzes', 'award', 'yellow', 200, 'quiz', 'rare'),
('Genius', 'Get perfect scores on 25 quizzes', 'brain', 'yellow', 500, 'quiz', 'epic'),

-- Streak achievements
('Consistency', 'Maintain a 3-day learning streak', 'calendar', 'green', 30, 'streak', 'common'),
('Dedication', 'Maintain a 7-day learning streak', 'flame', 'green', 70, 'streak', 'rare'),
('Unstoppable', 'Maintain a 30-day learning streak', 'zap', 'green', 300, 'streak', 'epic'),
('Legend', 'Maintain a 100-day learning streak', 'sparkles', 'green', 1000, 'streak', 'legendary'),

-- Subject specific
('Math Wizard', 'Complete all Mathematics chapters', 'calculator', 'blue', 300, 'subject', 'rare'),
('Science Explorer', 'Complete all Physics chapters', 'atom', 'purple', 300, 'subject', 'rare'),
('Chemistry Expert', 'Complete all Chemistry chapters', 'flask-conical', 'orange', 300, 'subject', 'rare'),
('Biology Scholar', 'Complete all Biology chapters', 'dna', 'green', 300, 'subject', 'rare'),
('Social Studies Pro', 'Complete all Social Studies chapters', 'globe', 'red', 300, 'subject', 'rare');

-- Function to calculate level from total points
CREATE OR REPLACE FUNCTION public.calculate_level(total_points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level formula: level = floor(sqrt(total_points / 100)) + 1
  -- This means: Level 1: 0-99 points, Level 2: 100-399 points, Level 3: 400-899 points, etc.
  RETURN GREATEST(1, FLOOR(SQRT(total_points::NUMERIC / 100)) + 1);
END;
$$;

-- Function to award points and update user scores
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  current_date DATE;
  current_scores RECORD;
  new_streak INTEGER;
BEGIN
  current_date := CURRENT_DATE;
  
  -- Get current user scores or create if doesn't exist
  SELECT * INTO current_scores FROM public.user_scores WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Create new user scores record
    INSERT INTO public.user_scores (user_id, total_points, level, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, p_points, public.calculate_level(p_points), 1, 1, current_date);
    new_streak := 1;
  ELSE
    -- Calculate new streak
    IF current_scores.last_activity_date = current_date THEN
      -- Same day, keep current streak
      new_streak := current_scores.current_streak;
    ELSIF current_scores.last_activity_date = current_date - 1 THEN
      -- Consecutive day, increment streak
      new_streak := current_scores.current_streak + 1;
    ELSE
      -- Streak broken, reset to 1
      new_streak := 1;
    END IF;
    
    -- Update user scores
    UPDATE public.user_scores 
    SET 
      total_points = current_scores.total_points + p_points,
      level = public.calculate_level(current_scores.total_points + p_points),
      current_streak = new_streak,
      longest_streak = GREATEST(current_scores.longest_streak, new_streak),
      last_activity_date = current_date,
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Record the transaction
  INSERT INTO public.point_transactions (user_id, points, reason, reference_id, reference_type)
  VALUES (p_user_id, p_points, p_reason, p_reference_id, p_reference_type);
  
  -- Check and award new badges
  PERFORM public.check_and_award_badges(p_user_id);
END;
$$;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  user_score RECORD;
  badge RECORD;
BEGIN
  -- Get current user scores
  SELECT * INTO user_score FROM public.user_scores WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Check each badge and award if criteria met
  FOR badge IN SELECT * FROM public.badges LOOP
    -- Skip if user already has this badge
    IF EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = p_user_id AND badge_id = badge.id) THEN
      CONTINUE;
    END IF;
    
    -- Check badge criteria based on category
    CASE badge.category
      WHEN 'general' THEN
        IF badge.name = 'First Steps' AND user_score.chapters_completed >= 1 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Scholar' AND user_score.chapters_completed >= 10 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Dedicated Learner' AND user_score.chapters_completed >= 25 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Academic Master' AND user_score.chapters_completed >= 50 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        END IF;
      
      WHEN 'quiz' THEN
        IF badge.name = 'Quiz Novice' AND user_score.quizzes_completed >= 1 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Perfect Score' AND user_score.perfect_scores >= 1 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Quiz Master' AND user_score.perfect_scores >= 10 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Genius' AND user_score.perfect_scores >= 25 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        END IF;
      
      WHEN 'streak' THEN
        IF badge.name = 'Consistency' AND user_score.current_streak >= 3 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Dedication' AND user_score.current_streak >= 7 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Unstoppable' AND user_score.current_streak >= 30 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        ELSIF badge.name = 'Legend' AND user_score.current_streak >= 100 THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        END IF;
      
      ELSE
        -- Points-based badges
        IF user_score.total_points >= badge.points_required THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge.id);
        END IF;
    END CASE;
  END LOOP;
END;
$$;