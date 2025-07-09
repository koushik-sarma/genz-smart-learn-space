import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TestTube, BookOpen, Lightbulb, MessageCircle, ScrollText, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';

interface ChemistryChapter {
  chemistry_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}

interface ChemistryNotes {
  chemistry_notes_id: number;
  board_id: number;
  subject_id: number;
  chapter_id: number;
  chapter_summary: string;
  chapter_important_diagrams: string;
  chapter_quick_recall: string;
  chapter_discussion_points: string;
  chapter_chemical_equation: string;
  chapter_chemical_formulae: string;
  chapter_takeaways: string;
}

export default function ChemistryChapter() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [chapter, setChapter] = useState<ChemistryChapter | null>(null);
  const [notes, setNotes] = useState<ChemistryNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && chapterId) {
      fetchChapterData();
    }
  }, [user, chapterId]);

  const fetchChapterData = async () => {
    if (!user || !chapterId) return;

    try {
      // Fetch chapter details
      const { data: chapterData, error: chapterError } = await supabase
        .from('dim_chemistry_subject')
        .select('*')
        .eq('chemistry_chapter_id', parseInt(chapterId))
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Fetch chapter notes
      const { data: notesData, error: notesError } = await supabase
        .from('dim_chemistry_chapters_notes')
        .select('*')
        .eq('chapter_id', parseInt(chapterId))
        .eq('board_id', chapterData.board_id)
        .eq('subject_id', chapterData.subject_id)
        .maybeSingle();

      if (notesError && notesError.code !== 'PGRST116') throw notesError;
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
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/chemistry')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chemistry
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <TestTube className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
              <p className="text-gray-300">Chapter {chapter.chemistry_chapter_id} • Chemistry</p>
            </div>
          </div>
        </div>

        {/* Chapter Overview */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Chapter Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 mb-4">
              {chapter.chapter_description}
            </div>
            {chapter.part && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Part: {chapter.part}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Notes
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* No simulations for chemistry yet - can be added later */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
              <CardContent>
                <div className="text-white text-lg mb-2">Interactive Content Coming Soon</div>
                <div className="text-gray-300">
                  Chemistry simulations and interactive content will be available here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            {notes ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chapter Summary */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ScrollText className="w-5 h-5" />
                      Chapter Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {notes.chapter_summary}
                    </div>
                  </CardContent>
                </Card>

                {/* Chemical Equations */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Chemical Equations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap font-mono">
                      {notes.chapter_chemical_equation}
                    </div>
                  </CardContent>
                </Card>

                {/* Chemical Formulae */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TestTube className="w-5 h-5" />
                      Chemical Formulae
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap font-mono">
                      {notes.chapter_chemical_formulae}
                    </div>
                  </CardContent>
                </Card>

                {/* Important Diagrams */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Important Diagrams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {notes.chapter_important_diagrams}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Recall */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Quick Recall
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {notes.chapter_quick_recall}
                    </div>
                  </CardContent>
                </Card>

                {/* Discussion Points */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Discussion Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {notes.chapter_discussion_points}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Takeaways */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Key Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {notes.chapter_takeaways}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
                <CardContent>
                  <div className="text-white text-lg mb-2">No notes available</div>
                  <div className="text-gray-300">
                    Chapter notes will appear here once they're available.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
            />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}