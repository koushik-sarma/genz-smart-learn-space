import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { UserBadge } from "@/hooks/useRewards";

interface CompactBadgeDisplayProps {
  userBadges: UserBadge[];
  maxDisplay?: number;
}

export const CompactBadgeDisplay = ({ userBadges, maxDisplay = 3 }: CompactBadgeDisplayProps) => {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.Award className="h-5 w-5" />;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
      case 'rare': return 'bg-blue-500/20 border-blue-400/30 text-blue-300';
      case 'epic': return 'bg-purple-500/20 border-purple-400/30 text-purple-300';
      case 'legendary': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
    }
  };

  if (userBadges.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Badges</h3>
          <Badge variant="secondary" className="bg-white/10 text-white/70">
            0 earned
          </Badge>
        </div>
        <div className="text-center text-white/60 py-4">
          Complete chapters to earn your first badge!
        </div>
      </div>
    );
  }

  const displayBadges = userBadges.slice(0, maxDisplay);
  const remainingCount = userBadges.length - maxDisplay;

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Badges</h3>
        <Badge variant="secondary" className="bg-white/10 text-white/70">
          {userBadges.length} earned
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        {displayBadges.map((userBadge) => (
          <div
            key={userBadge.id}
            className={`p-3 rounded-lg border backdrop-blur-sm ${getRarityColor(userBadge.badge.rarity)}`}
            title={userBadge.badge.description}
          >
            <div className="flex flex-col items-center gap-2">
              {getIcon(userBadge.badge.icon)}
              <div className="text-xs font-medium text-center">
                {userBadge.badge.name}
              </div>
            </div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="p-3 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-white/60">
              <Icons.Plus className="h-5 w-5" />
              <div className="text-xs font-medium">
                +{remainingCount}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};