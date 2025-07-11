import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MathematicsChapter {
  math_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}

export default function Mathematics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<MathematicsChapter[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMathematicsData();
    }
  }, [user]);

  const fetchMathematicsData = async () => {
    if (!user) return;

    try {
      // First fetch user profile to get class and board
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Get the board_id based on board name
      const { data: boardData, error: boardError } = await supabase
        .from('dim_boards')
        .select('board_id')
        .eq('board_name', profileData.board_of_education)
        .single();

      if (boardError) throw boardError;

      // Get the subject_id for Mathematics
      const { data: subjectData, error: subjectError } = await supabase
        .from('dim_subjects')
        .select('subject_id')
        .eq('subject_name', 'Mathematics')
        .eq('class', parseInt(profileData.class))
        .eq('board_name', profileData.board_of_education)
        .single();

      if (subjectError) throw subjectError;

      // Fetch mathematics chapters based on user's class, board, and subject
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('dim_mathematics_subject')
        .select('*')
        .eq('class', parseInt(profileData.class))
        .eq('board_id', boardData.board_id)
        .eq('subject_id', subjectData.subject_id)
        .order('math_chapter_id');

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);

    } catch (error: any) {
      toast({
        title: "Error loading mathematics chapters",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading mathematics chapters...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">Mathematics</h1>
              <p className="text-gray-300">Class {profile?.class} • {profile?.board_of_education}</p>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Card key={chapter.math_chapter_id} className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader>
                <div className="text-sm text-purple-300 mb-2">Chapter {chapter.math_chapter_id}</div>
                <CardTitle className="text-white text-lg">{chapter.chapter}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-300">
                  {chapter.chapter_description}
                </div>
                
                {chapter.part && (
                  <div className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full inline-block">
                    Part: {chapter.part}
                  </div>
                )}
                
                <div className="flex justify-end items-center pt-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={() => navigate(`/mathematics/chapter/${chapter.math_chapter_id}`)}
                  >
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {chapters.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
            <CardContent>
              <div className="text-white text-lg mb-2">No chapters found</div>
              <div className="text-gray-300">
                Mathematics chapters for your class and board will appear here once they're available.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}