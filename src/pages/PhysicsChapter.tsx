import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, MessageCircle, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import QuizInterface from '@/components/QuizInterface';

interface ChapterNotes {
  physics_notes_id: number;
  chapter_summary: string;
  chapter_discussion_points: string;
  chapter_formulae: string;
  chapter_important_diagrams: string;
  chapter_takeaways: string;
  chapter_id: number;
  board_id: number;
  subject_id: number;
  class: number;
}

interface Chapter {
  physic_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}

export default function PhysicsChapter() {
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
        .from('dim_physics_subject')
        .select('*')
        .eq('physic_chapter_id', parseInt(chapterId))
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Then fetch chapter notes
      const { data: notesData, error: notesError } = await supabase
        .from('dim_physics_chapters_notes')
        .select('*')
        .eq('chapter_id', parseInt(chapterId))
        .eq('board_id', chapterData.board_id)
        .eq('subject_id', chapterData.subject_id)
        .eq('class', chapterData.class)
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
            onClick={() => navigate('/physics')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Physics
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <div className="text-sm text-purple-300">Chapter {chapter.physic_chapter_id}</div>
              <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
              <p className="text-gray-300">{chapter.chapter_description}</p>
            </div>
          </div>
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
                    <CardTitle className="text-white">Important Formulae</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-3">
                      {notes.chapter_formulae.split(/[;.]/).filter(formula => formula.trim()).map((formula, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-md border border-white/10">
                          <code className="text-purple-300 font-mono text-sm">{formula.trim()}</code>
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
            {chapter.physic_chapter_id === 1 ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Reflection Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/reflection-simulation.html.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Reflection of Light Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : chapter.chapter.toLowerCase().includes('refraction') ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Refraction Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/refraction-simulation.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Refraction of Light Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : (chapter.chapter.toLowerCase().includes('human eye') || 
                 chapter.chapter.toLowerCase().includes('eye') || 
                 chapter.chapter.toLowerCase().includes('light') ||
                 chapter.chapter.toLowerCase().includes('colorful world')) ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Human Eye and Light Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/human-eye-and-light.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Human Eye and Light Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : (chapter.chapter.toLowerCase().includes('electric') || 
                 chapter.chapter.toLowerCase().includes('current') || 
                 chapter.chapter.toLowerCase().includes('circuit') ||
                 chapter.chapter.toLowerCase().includes('electricity')) ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Electric Circuit Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/circuit-simulation.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Electric Circuit Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : (chapter.chapter.toLowerCase().includes('electromagnetism') || 
                 chapter.chapter.toLowerCase().includes('electromagnetic') || 
                 chapter.chapter.toLowerCase().includes('magnet')) ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Electromagnetism Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/Electromagnetism.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Electromagnetism Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : (chapter.chapter.toLowerCase().includes('structure of atom') || 
                 chapter.chapter.toLowerCase().includes('atomic structure') || 
                 chapter.chapter.toLowerCase().includes('atom')) ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Structure of Atom Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="/Structure-of-atom.html"
                    className="w-full h-[600px] border-0 rounded-b-lg"
                    title="Structure of Atom Simulation"
                    style={{ minHeight: '600px' }}
                  />
                </CardContent>
              </Card>
            ) : (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}