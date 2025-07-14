import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { LeaderboardEntry } from "@/hooks/useRewards";

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

export const LeaderboardCard = ({ leaderboard, currentUserId }: LeaderboardCardProps) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 2: return <Medal className="h-5 w-5 text-gray-600" />;
      case 3: return <Award className="h-5 w-5 text-orange-600" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return "bg-yellow-50 border-yellow-200";
      case 2: return "bg-gray-50 border-gray-200";
      case 3: return "bg-orange-50 border-orange-200";
      default: return "bg-background border-border";
    }
  };

  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.profiles?.first_name || entry.profiles?.last_name) {
      return `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim();
    }
    return 'Anonymous Student';
  };

  const getInitials = (entry: LeaderboardEntry) => {
    if (entry.profiles?.first_name || entry.profiles?.last_name) {
      return `${entry.profiles.first_name?.[0] || ''}${entry.profiles.last_name?.[0] || ''}`.toUpperCase();
    }
    return 'AS';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No students on the leaderboard yet. Be the first to earn points!
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const position = index + 1;
              const isCurrentUser = entry.user_id === currentUserId;
              
              return (
                <div
                  key={entry.user_id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${getRankColor(position)} ${
                    isCurrentUser ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(position)}
                        <span className="font-bold text-lg">#{position}</span>
                      </div>
                      
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(entry)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-semibold">
                          {getDisplayName(entry)}
                          {isCurrentUser && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level {entry.level} • {entry.chapters_completed} chapters
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {entry.total_points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                  
                  {entry.current_streak > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                      <Star className="h-3 w-3" />
                      <span>{entry.current_streak} day streak</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};