import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target, BookOpen } from "lucide-react";
import { UserScore } from "@/hooks/useRewards";

interface UserStatsCardProps {
  userScore: UserScore | null;
  pointsForNextLevel: number;
}

export const UserStatsCard = ({ userScore, pointsForNextLevel }: UserStatsCardProps) => {
  if (!userScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Complete your first chapter to start earning points!
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressToNextLevel = pointsForNextLevel > 0 
    ? Math.max(0, 100 - (pointsForNextLevel / (Math.pow(userScore.level, 2) * 100)) * 100)
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level and Points */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">Level {userScore.level}</div>
            <div className="text-sm text-muted-foreground">{userScore.total_points.toLocaleString()} points</div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {userScore.total_points.toLocaleString()}
          </Badge>
        </div>

        {/* Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {userScore.level + 1}</span>
            <span>{pointsForNextLevel > 0 ? `${pointsForNextLevel} points to go` : 'Max level!'}</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Zap className="h-4 w-4 text-yellow-600" />
            <div>
              <div className="font-semibold">{userScore.current_streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Target className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-semibold">{userScore.longest_streak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-semibold">{userScore.chapters_completed}</div>
              <div className="text-xs text-muted-foreground">Chapters</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Trophy className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-semibold">{userScore.perfect_scores}</div>
              <div className="text-xs text-muted-foreground">Perfect Scores</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};