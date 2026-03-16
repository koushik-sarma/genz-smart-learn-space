import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube2, MessageCircle, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';
import ChapterHeader from '@/components/chemistry/ChapterHeader';
import SummaryTab from '@/components/chemistry/SummaryTab';
import SimulationTab from '@/components/chemistry/SimulationTab';
import { ChapterNotes, Chapter } from '@/types/chemistry';

export default function ChemistryChapter() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<ChapterNotes | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapterId) {
      fetchChapterData();
    }
  }, [chapterId]);

  const fetchChapterData = async () => {
    if (!chapterId) return;

    try {
      // First fetch chapter info
      const { data: chapterData, error: chapterError } = await supabase
        .from('dim_chemistry_subject')
        .select('*')
        .eq('chemistry_chapter_id', parseInt(chapterId))
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Then fetch chapter notes
      const { data: notesData, error: notesError } = await supabase
        .from('dim_chemistry_chapters_notes')
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
        <ChapterHeader chapter={chapter} />

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="summary" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              <TestTube2 className="w-4 h-4 mr-2" />
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
            <SummaryTab notes={notes} />
          </TabsContent>

          <TabsContent value="tutor" className="mt-6">
            <ChatInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Chemistry"
            />
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Chemistry"
            />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <SimulationTab chapter={chapter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}