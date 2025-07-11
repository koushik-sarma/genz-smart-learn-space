import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { MathematicsChapter, MathematicsChapterNotes } from '@/types/mathematics';
import { ChapterHeader } from '@/components/mathematics/ChapterHeader';
import { SummaryTab } from '@/components/mathematics/SummaryTab';
import { SimulationTab } from '@/components/mathematics/SimulationTab';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';

export default function MathematicsChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [chapter, setChapter] = useState<MathematicsChapter | null>(null);
  const [notes, setNotes] = useState<MathematicsChapterNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (user && chapterId) {
      fetchChapterData();
    }
  }, [user, chapterId]);

  const fetchChapterData = async () => {
    if (!user || !chapterId) return;

    try {
      // Fetch chapter information
      const { data: chapterData, error: chapterError } = await supabase
        .from('dim_maths_subject')
        .select('*')
        .eq('maths_chapter_id', parseInt(chapterId))
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Fetch chapter notes
      const { data: notesData, error: notesError } = await supabase
        .from('dim_maths_chapters_notes')
        .select('*')
        .eq('chapter_id', parseInt(chapterId))
        .single();

      if (notesError && notesError.code !== 'PGRST116') {
        throw notesError;
      }
      
      setNotes(notesData);

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
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/mathematics')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mathematics
          </Button>
        </div>

        <ChapterHeader chapter={chapter} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="summary" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Summary
            </TabsTrigger>
            <TabsTrigger value="ai-tutor" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Quiz
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Simulation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <SummaryTab notes={notes} />
          </TabsContent>

          <TabsContent value="ai-tutor" className="mt-6">
            <ChatInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Mathematics"
            />
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
              subject="Mathematics"
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