import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useRewards } from '@/hooks/useRewards';
import { BadgeDisplay } from '@/components/rewards/BadgeDisplay';
import { Skeleton } from "@/components/ui/skeleton";

export default function Badges() {
  const navigate = useNavigate();
  const { userBadges, allBadges, loading } = useRewards();

  useEffect(() => {
    document.title = "Badges - Learning Platform";
  }, []);

  const categoryStats = {
    general: { earned: 0, total: 0 },
    quiz: { earned: 0, total: 0 },
    streak: { earned: 0, total: 0 },
    subject: { earned: 0, total: 0 }
  };

  // Calculate stats by category
  allBadges.forEach(badge => {
    const category = badge.category as keyof typeof categoryStats;
    if (categoryStats[category]) {
      categoryStats[category].total++;
      if (userBadges.some(ub => ub.badge_id === badge.id)) {
        categoryStats[category].earned++;
      }
    }
  });

  const totalEarned = userBadges.length;
  const totalAvailable = allBadges.length;
  const completionPercentage = totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              Badge Collection
            </h1>
            <p className="text-muted-foreground">
              Earn badges by completing chapters, quizzes, and maintaining streaks
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {totalEarned} of {totalAvailable} badges
              </div>
            </CardContent>
          </Card>

          {Object.entries(categoryStats).map(([category, stats]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {category === 'general' ? 'Learning' : category} Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.earned}/{stats.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0}% complete
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Badge Collection */}
        <BadgeDisplay 
          userBadges={userBadges} 
          allBadges={allBadges} 
          showAll={true}
          title="All Badges"
        />

        {/* Badge Categories */}
        <div className="space-y-6">
          {['general', 'quiz', 'streak', 'subject'].map(category => {
            const categoryBadges = allBadges.filter(badge => badge.category === category);
            const categoryUserBadges = userBadges.filter(ub => 
              categoryBadges.some(cb => cb.id === ub.badge_id)
            );

            if (categoryBadges.length === 0) return null;

            return (
              <BadgeDisplay
                key={category}
                userBadges={categoryUserBadges}
                allBadges={categoryBadges}
                showAll={true}
                title={`${category.charAt(0).toUpperCase() + category.slice(1)} Badges`}
              />
            );
          })}
        </div>

        {/* Achievement Tips */}
        <Card>
          <CardHeader>
            <CardTitle>How to Earn Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Learning Progress</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete chapters to earn learning badges</li>
                  <li>• Finish entire subjects for subject-specific badges</li>
                  <li>• First Steps: Complete your very first chapter</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Quiz Mastery</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take quizzes to earn quiz badges</li>
                  <li>• Get perfect scores (100%) for special recognition</li>
                  <li>• Quiz Master: Get 10 perfect scores</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Consistency</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Study daily to build learning streaks</li>
                  <li>• Longer streaks earn more prestigious badges</li>
                  <li>• Legend: Maintain 100-day streak</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Points & Levels</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Earn points through various activities</li>
                  <li>• Higher point totals unlock special badges</li>
                  <li>• Level up by accumulating points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}