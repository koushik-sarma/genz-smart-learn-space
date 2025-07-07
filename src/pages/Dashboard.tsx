import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch subjects based on user's class and board
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('dim_subjects')
        .select('*')
        .eq('class', parseInt(profileData.class))
        .eq('board_name', profileData.board_of_education);

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name}!</h1>
            <p className="text-gray-300 mt-2">Class {profile?.class} • {profile?.board_of_education}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Sign Out
          </Button>
        </div>

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