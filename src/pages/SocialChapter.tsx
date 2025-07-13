import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, MessageCircle, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';
import SocialChapterHeader from '@/components/social/ChapterHeader';
import SocialSummaryTab from '@/components/social/SummaryTab';
import SocialSimulationTab from '@/components/social/SimulationTab';
import type { SocialChapter, SocialChapterNotes } from '@/types/social';

export default function SocialChapter() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<SocialChapterNotes | null>(null);
  const [chapter, setChapter] = useState<SocialChapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && chapterId) {
      fetchChapterData();
    }
  }, [user, chapterId]);

  const fetchChapterData = async () => {
    if (!user || !chapterId) return;

    try {
      // First fetch chapter info
      const { data: chapterData, error: chapterError } = await supabase
        .from('dim_social_subject')
        .select('*')
        .eq('social_chapter_id', parseInt(chapterId))
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Then fetch chapter notes
      const { data: notesData, error: notesError } = await supabase
        .from('dim_social_chapters_notes')
        .select('*')
        .eq('chapter_id', parseInt(chapterId))
        .eq('board_id', chapterData.board_id)
        .eq('subject_id', chapterData.subject_id)
        .single();

      if (notesError) {
        console.log('No notes found:', notesError);
        setNotes(null);
      } else {
        setNotes(notesData);
      }

    } catch (error: any) {
      toast({
        title: "Error loading chapter",
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
        <div className="text-white text-lg">Loading chapter...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Chapter not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
      
      <div className="relative z-10 p-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/social')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Social Science
          </Button>
          
          <SocialChapterHeader chapter={chapter} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="summary" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              <BookOpen className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="tutor" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              <Brain className="w-4 h-4 mr-2" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              <Zap className="w-4 h-4 mr-2" />
              Simulation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <SocialSummaryTab notes={notes} />
          </TabsContent>

          <TabsContent value="tutor" className="mt-6">
            <ChatInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Social Science"
            />
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Social Science"
            />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <SocialSimulationTab chapter={chapter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}