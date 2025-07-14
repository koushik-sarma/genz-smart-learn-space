import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as Icons from "lucide-react";
import { Badge as BadgeType, UserBadge } from "@/hooks/useRewards";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  userBadges: UserBadge[];
  allBadges?: BadgeType[];
  showAll?: boolean;
  title?: string;
  maxDisplay?: number;
}

export const BadgeDisplay = ({ 
  userBadges, 
  allBadges = [], 
  showAll = false, 
  title = "Your Badges",
  maxDisplay = 6 
}: BadgeDisplayProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-700';
      case 'rare': return 'text-blue-700';
      case 'epic': return 'text-purple-700';
      case 'legendary': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="h-6 w-6" /> : <Icons.Award className="h-6 w-6" />;
  };

  const displayBadges = showAll 
    ? allBadges.map(badge => ({
        ...badge,
        earned: userBadges.some(ub => ub.badge_id === badge.id),
        earned_at: userBadges.find(ub => ub.badge_id === badge.id)?.earned_at
      }))
    : userBadges.slice(0, maxDisplay);

  const earnedCount = userBadges.length;
  const totalCount = allBadges.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {showAll && (
            <Badge variant="secondary">
              {earnedCount}/{totalCount} Earned
            </Badge>
          )}
          {!showAll && earnedCount > maxDisplay && (
            <Badge variant="secondary">
              +{earnedCount - maxDisplay} more
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayBadges.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {showAll ? "No badges available" : "No badges earned yet. Complete chapters and quizzes to earn your first badge!"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayBadges.map((item) => {
              const badge = 'badge' in item ? item.badge : item;
              const isEarned = 'earned' in item ? item.earned : true;
              
              return (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105",
                          getRarityColor(badge.rarity),
                          !isEarned && "opacity-40 grayscale"
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={getRarityText(badge.rarity)}>
                            {getIcon(badge.icon)}
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">{badge.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {badge.rarity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                        {badge.points_required > 0 && (
                          <div className="text-xs mt-1">
                            Requires: {badge.points_required} points
                          </div>
                        )}
                        {isEarned && 'earned_at' in item && item.earned_at && (
                          <div className="text-xs mt-1 text-green-600">
                            Earned: {new Date(item.earned_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};