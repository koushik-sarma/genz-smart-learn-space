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
  today_date DATE;
  current_scores RECORD;
  new_streak INTEGER;
BEGIN
  today_date := CURRENT_DATE;
  
  -- Get current user scores or create if doesn't exist
  SELECT * INTO current_scores FROM public.user_scores WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Create new user scores record
    INSERT INTO public.user_scores (user_id, total_points, level, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, p_points, public.calculate_level(p_points), 1, 1, today_date);
    new_streak := 1;
  ELSE
    -- Calculate new streak
    IF current_scores.last_activity_date = today_date THEN
      -- Same day, keep current streak
      new_streak := current_scores.current_streak;
    ELSIF current_scores.last_activity_date = today_date - 1 THEN
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
      last_activity_date = today_date,
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