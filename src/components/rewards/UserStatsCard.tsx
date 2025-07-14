import { Zap, BookOpen, Coins, Award } from "lucide-react";
import { UserScore } from "@/hooks/useRewards";

interface UserStatsCardProps {
  userScore: UserScore | null;
  userRank?: number;
}

export const UserStatsCard = ({ userScore, userRank }: UserStatsCardProps) => {
  if (!userScore) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-yellow-200">Day Streak</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-blue-200">Chapters</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Coins className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-green-200">Points</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">-</div>
              <div className="text-sm text-purple-200">Rank</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userScore.current_streak}</div>
            <div className="text-sm text-yellow-200">Day Streak</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userScore.chapters_completed}</div>
            <div className="text-sm text-blue-200">Chapters</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Coins className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userScore.total_points.toLocaleString()}</div>
            <div className="text-sm text-green-200">Points</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Award className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">#{userRank || '-'}</div>
            <div className="text-sm text-purple-200">Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};