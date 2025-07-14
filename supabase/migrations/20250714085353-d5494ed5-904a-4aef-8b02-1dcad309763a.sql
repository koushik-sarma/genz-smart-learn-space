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

-- Function to update chapter completion count
CREATE OR REPLACE FUNCTION public.update_chapter_completion(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update chapter completion count and award points
  UPDATE public.user_scores 
  SET 
    chapters_completed = chapters_completed + 1,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- If user doesn't exist, create record
  INSERT INTO public.user_scores (user_id, chapters_completed, total_points, level)
  VALUES (p_user_id, 1, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Award points for chapter completion
  SELECT public.award_points(p_user_id, 10, 'Chapter completed', NULL, 'chapter_completion');
END;
$$;

-- Function to update quiz completion count
CREATE OR REPLACE FUNCTION public.update_quiz_completion(p_user_id UUID, p_score INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  points_earned INTEGER;
  is_perfect BOOLEAN;
BEGIN
  is_perfect := (p_score = 100);
  points_earned := CASE 
    WHEN is_perfect THEN 20
    WHEN p_score >= 80 THEN 15
    WHEN p_score >= 60 THEN 10
    ELSE 5
  END;
  
  -- Update quiz completion count
  UPDATE public.user_scores 
  SET 
    quizzes_completed = quizzes_completed + 1,
    perfect_scores = perfect_scores + CASE WHEN is_perfect THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- If user doesn't exist, create record
  INSERT INTO public.user_scores (user_id, quizzes_completed, perfect_scores, total_points, level)
  VALUES (p_user_id, 1, CASE WHEN is_perfect THEN 1 ELSE 0 END, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Award points for quiz completion
  SELECT public.award_points(p_user_id, points_earned, 'Quiz completed with ' || p_score || '%', NULL, 'quiz_completion');
END;
$$;