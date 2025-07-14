import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserScore {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  chapters_completed: number;
  quizzes_completed: number;
  perfect_scores: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points_required: number;
  category: string;
  rarity: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  current_streak: number;
  chapters_completed: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const useRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PointTransaction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's score and progress
  const fetchUserScore = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user score:', error);
        return;
      }

      setUserScore(data);
    } catch (error) {
      console.error('Error fetching user score:', error);
    }
  };

  // Fetch user's badges
  const fetchUserBadges = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        return;
      }

      setUserBadges(data || []);
    } catch (error) {
      console.error('Error fetching user badges:', error);
    }
  };

  // Fetch all available badges
  const fetchAllBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: true })
        .order('points_required', { ascending: true });

      if (error) {
        console.error('Error fetching badges:', error);
        return;
      }

      setAllBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Fetch recent point transactions
  const fetchRecentTransactions = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setRecentTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      // First get the top user scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('user_scores')
        .select('user_id, total_points, level, current_streak, chapters_completed')
        .order('total_points', { ascending: false })
        .limit(10);

      if (scoresError) {
        console.error('Error fetching leaderboard scores:', scoresError);
        return;
      }

      if (!scoresData || scoresData.length === 0) {
        setLeaderboard([]);
        return;
      }

      // Then get the profile data for these users
      const userIds = scoresData.map(score => score.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching leaderboard profiles:', profilesError);
      }

      // Combine the data
      const leaderboardData = scoresData.map(score => ({
        ...score,
        profiles: profilesData?.find(p => p.user_id === score.user_id) || null
      }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Award points for chapter completion
  const awardChapterCompletion = async (chapterId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.rpc('update_chapter_completion', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error awarding chapter completion:', error);
        return;
      }

      // Refresh user data
      await Promise.all([
        fetchUserScore(),
        fetchUserBadges(),
        fetchRecentTransactions()
      ]);

      toast({
        title: "Chapter Completed! 🎉",
        description: "You earned 10 points for completing this chapter!",
      });
    } catch (error) {
      console.error('Error awarding chapter completion:', error);
    }
  };

  // Award points for quiz completion
  const awardQuizCompletion = async (score: number) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.rpc('update_quiz_completion', {
        p_user_id: user.id,
        p_score: score
      });

      if (error) {
        console.error('Error awarding quiz completion:', error);
        return;
      }

      // Refresh user data
      await Promise.all([
        fetchUserScore(),
        fetchUserBadges(),
        fetchRecentTransactions()
      ]);

      const points = score === 100 ? 20 : score >= 80 ? 15 : score >= 60 ? 10 : 5;
      toast({
        title: `Quiz Completed! 🎯`,
        description: `You scored ${score}% and earned ${points} points!`,
      });
    } catch (error) {
      console.error('Error awarding quiz completion:', error);
    }
  };

  // Calculate points needed for next level
  const getPointsForNextLevel = () => {
    if (!userScore) return 0;
    const nextLevel = userScore.level + 1;
    const pointsNeeded = Math.pow(nextLevel - 1, 2) * 100;
    return pointsNeeded - userScore.total_points;
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  // Check if user has specific badge
  const hasBadge = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  useEffect(() => {
    const initializeRewards = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserScore(),
        fetchUserBadges(),
        fetchAllBadges(),
        fetchRecentTransactions(),
        fetchLeaderboard()
      ]);
      setLoading(false);
    };

    if (user) {
      initializeRewards();
    }
  }, [user]);

  return {
    userScore,
    userBadges,
    allBadges,
    recentTransactions,
    leaderboard,
    loading,
    awardChapterCompletion,
    awardQuizCompletion,
    getPointsForNextLevel,
    getRarityColor,
    hasBadge,
    refreshData: async () => {
      await Promise.all([
        fetchUserScore(),
        fetchUserBadges(),
        fetchRecentTransactions(),
        fetchLeaderboard()
      ]);
    }
  };
};