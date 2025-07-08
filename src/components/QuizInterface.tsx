import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizInterfaceProps {
  chapterTitle: string;
  chapterNotes: any;
}

export default function QuizInterface({ chapterTitle, chapterNotes }: QuizInterfaceProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-physics-quiz', {
        body: {
          chapterTitle,
          chapterNotes
        }
      });

      if (error) throw error;

      if (data && data.questions) {
        setQuiz(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        toast({
          title: "Quiz Generated!",
          description: `Generated ${data.questions.length} questions for ${chapterTitle}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to generate quiz: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuiz([]);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizStarted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!quizStarted) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white text-center flex items-center justify-center gap-2">
            <Brain className="h-6 w-6" />
            Physics Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-300 mb-6 text-sm">
            Test your understanding of {chapterTitle} with AI-generated questions tailored to the chapter content.
          </div>
          <Button 
            onClick={generateQuiz}
            disabled={isGenerating}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = quiz.length;
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <Brain className="h-5 w-5" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(score, total)}`}>
              {score}/{total}
            </div>
            <div className="text-gray-300 mb-4 text-sm">
              {score === total ? "Perfect! 🎉" : score >= total * 0.8 ? "Great job! 👏" : score >= total * 0.6 ? "Good effort! 👍" : "Keep studying! 📚"}
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetQuiz} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={generateQuiz} className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm">
                <Brain className="w-4 h-4 mr-2" />
                New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results in Scrollable Container */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Question Review</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              <div className="space-y-3 p-4">
                {quiz.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium mb-3 text-sm">
                            Question {index + 1}: {question.question}
                          </h3>
                          
                          <div className="space-y-1 mb-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded-md border text-sm ${
                                  optionIndex === question.correctAnswer
                                    ? 'border-green-400 bg-green-400/10'
                                    : optionIndex === userAnswer && !isCorrect
                                    ? 'border-red-400 bg-red-400/10'
                                    : 'border-white/20'
                                }`}
                              >
                                <span className="text-gray-300">{option}</span>
                                {optionIndex === question.correctAnswer && (
                                  <span className="text-green-400 ml-2 text-xs">✓ Correct</span>
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <span className="text-red-400 ml-2 text-xs">✗ Your answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-blue-400 font-medium text-sm">Explanation:</span>
                                <p className="text-gray-300 mt-1 text-sm">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium text-sm">Question {currentQuestionIndex + 1} of {quiz.length}</span>
          <span className="text-gray-300 text-sm">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/5 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-gray-300 cursor-pointer flex-1 text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button 
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm"
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestionIndex === quiz.length - 1 ? (
            <Button 
              onClick={submitQuiz}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}