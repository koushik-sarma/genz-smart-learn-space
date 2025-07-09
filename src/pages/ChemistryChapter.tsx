import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TestTube2, MessageCircle, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';

interface ChapterNotes {
  chemistry_notes_id: number;
  chapter_summary: string;
  chapter_takeaways: string;
  chapter_discussion_points: string;
  chapter_chemical_formulae: string;
  chapter_chemical_equation: string;
  chapter_quick_recall: string;
  chapter_important_diagrams: string;
  chapter_id: number;
  board_id: number;
  subject_id: number;
}

interface Chapter {
  chemistry_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}

export default function ChemistryChapter() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<ChapterNotes | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
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
              <TestTube2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <div className="text-sm text-purple-300">Chapter {chapter.chemistry_chapter_id}</div>
              <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
              <p className="text-gray-300">{chapter.chapter_description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
            {notes ? (
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Chapter Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-2">
                      {notes.chapter_summary.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-300 mt-1">•</span>
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Key Takeaways</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-2">
                      {notes.chapter_takeaways.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-300 mt-1">•</span>
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Key Discussion Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-2">
                      {notes.chapter_discussion_points.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-300 mt-1">•</span>
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Important Chemical Formulae</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-3">
                      {notes.chapter_chemical_formulae.split(/[;.]/).filter(formula => formula.trim()).map((formula, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-md border border-white/10">
                          <code className="text-purple-300 font-mono text-sm">{formula.trim()}</code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Chemical Equations to Remember</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-3">
                      {notes.chapter_chemical_equation.split(/[;.]/).filter(equation => equation.trim()).map((equation, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-md border border-white/10">
                          <code className="text-purple-300 font-mono text-sm">{equation.trim()}</code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Recall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-2">
                      {notes.chapter_quick_recall.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-300 mt-1">•</span>
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Important Diagrams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-2">
                      {notes.chapter_important_diagrams.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-300 mt-1">•</span>
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
                <CardContent>
                  <div className="text-white text-lg mb-2">No notes available</div>
                  <div className="text-gray-300">
                    Notes for this chapter will be available soon.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tutor" className="mt-6">
            <ChatInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
            />
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizInterface 
              chapterTitle={chapter.chapter}
              chapterNotes={notes}
            />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
              <CardContent>
                <Zap className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <div className="text-white text-lg mb-2">Interactive Simulation</div>
                <div className="text-gray-300 mb-4">
                  Explore {chapter.chapter} through interactive simulations
                </div>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Launch Simulation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}