import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';
import { UserStatsCard } from '@/components/rewards/UserStatsCard';
import { CompactBadgeDisplay } from '@/components/rewards/CompactBadgeDisplay';
import { Edit, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Subject {
  subject_id: number;
  subject_name: string;
  total_chapters: number;
  board_name: string;
  class: number;
}

interface UserProgress {
  subject_id: number;
  completed_chapters: number;
}

const DEFAULT_BOARD = 'Telangana State Board';
const DEFAULT_CLASS = 10;

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userScore, userBadges, leaderboard, getPointsForNextLevel } = useRewards();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    boardOfEducation: '',
    class: '',
    city: '',
    state: ''
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      let boardName = DEFAULT_BOARD;
      let classNum = DEFAULT_CLASS;

      if (user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
          boardName = profileData.board_of_education || DEFAULT_BOARD;
          classNum = parseInt(profileData.class) || DEFAULT_CLASS;
        }

        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);
        setUserProgress(progressData || []);
      }

      // Fetch subjects based on class and board
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('dim_subjects')
        .select('*')
        .eq('class', classNum)
        .eq('board_name', boardName);

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (subjectId: number, totalChapters: number) => {
    const progress = userProgress.find(p => p.subject_id === subjectId);
    const completed = progress?.completed_chapters || 0;
    return Math.round((completed / totalChapters) * 100);
  };

  const getCompletedChapters = (subjectId: number) => {
    const progress = userProgress.find(p => p.subject_id === subjectId);
    return progress?.completed_chapters || 0;
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate('/');
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        boardOfEducation: profile.board_of_education || '',
        class: profile.class || '',
        city: profile.city || '',
        state: profile.state || ''
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editFormData.firstName,
          last_name: editFormData.lastName,
          board_of_education: editFormData.boardOfEducation,
          class: editFormData.class,
          city: editFormData.city,
          state: editFormData.state
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved."
      });

      setIsEditDialogOpen(false);
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  const displayName = profile?.first_name || 'Learner';
  const displayClass = profile?.class || `${DEFAULT_CLASS}th`;
  const displayBoard = profile?.board_of_education || DEFAULT_BOARD;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Welcome, {displayName}!</h1>
            <p className="text-gray-300 mt-2">Class {displayClass} • {displayBoard}</p>
          </div>
          <div className="flex gap-2">
            {user && profile && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={handleEditProfile}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Edit Profile</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={editFormData.firstName}
                          onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={editFormData.lastName}
                          onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="board" className="text-white">Board of Education</Label>
                      <Select value={editFormData.boardOfEducation} onValueChange={(value) => setEditFormData({ ...editFormData, boardOfEducation: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          <SelectItem value="Telangana State Board">Telangana State Board</SelectItem>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="ICSE">ICSE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="class" className="text-white">Class</Label>
                      <Select value={editFormData.class} onValueChange={(value) => setEditFormData({ ...editFormData, class: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          <SelectItem value="6th">6th</SelectItem>
                          <SelectItem value="7th">7th</SelectItem>
                          <SelectItem value="8th">8th</SelectItem>
                          <SelectItem value="9th">9th</SelectItem>
                          <SelectItem value="10th">10th</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">City</Label>
                        <Input
                          id="city"
                          type="text"
                          value={editFormData.city}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">State</Label>
                        <Input
                          id="state"
                          type="text"
                          value={editFormData.state}
                          onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Badges button hidden until auth is fully set up */}

            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Login
              </Button>
            )}
          </div>
        </div>

        {/* Rewards Overview - only for logged in users */}
        {user && (
          <div className="mb-8">
            <UserStatsCard 
              userScore={userScore} 
              userRank={leaderboard.findIndex(entry => entry.user_id === user?.id) + 1 || undefined}
            />
          </div>
        )}

        {/* Recent Badges - only for logged in users */}
        {user && userBadges.length > 0 && (
          <div className="mb-8">
            <CompactBadgeDisplay 
              userBadges={userBadges}
              maxDisplay={4}
            />
          </div>
        )}

        {/* Overall Progress */}
        <Card className="mb-8 bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Your Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{subjects.length}</div>
                <div className="text-gray-300">Total Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {userProgress.reduce((acc, p) => acc + p.completed_chapters, 0)}
                </div>
                <div className="text-gray-300">Chapters Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.round(subjects.reduce((acc, s) => acc + getProgressPercentage(s.subject_id, s.total_chapters), 0) / subjects.length) || 0}%
                </div>
                <div className="text-gray-300">Average Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const progressPercentage = getProgressPercentage(subject.subject_id, subject.total_chapters);
            const completedChapters = getCompletedChapters(subject.subject_id);
            
            return (
              <Card key={subject.subject_id} className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{subject.subject_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Progress</span>
                    <span>{completedChapters} / {subject.total_chapters} chapters</span>
                  </div>
                  
                  <Progress 
                    value={progressPercentage} 
                    className="h-3 bg-white/20"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">{progressPercentage}%</span>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      onClick={() => {
                        if (subject.subject_name === 'Physics') {
                          navigate('/physics');
                        } else if (subject.subject_name === 'Chemistry') {
                          navigate('/chemistry');
                        } else if (subject.subject_name === 'Biology') {
                          navigate('/biology');
                        } else if (subject.subject_name === 'Mathematics') {
                          navigate('/mathematics');
                        } else if (subject.subject_name === 'Social Studies - Part 1') {
                          navigate('/social');
                        } else if (subject.subject_name === 'Social Studies - Part 2') {
                          navigate('/social-part2');
                        }
                      }}
                    >
                      {progressPercentage === 0 ? 'Start Learning' : 'Continue'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {subjects.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
            <CardContent>
              <div className="text-white text-lg mb-2">No subjects found</div>
              <div className="text-gray-300">
                Subjects for your class and board will appear here once they're available.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
