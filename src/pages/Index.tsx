import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookUser, LayoutDashboard, ListCheck, MessageCircle, User, Calendar, FileText, Search } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Engage with dynamic, multimedia content that adapts to your learning style"
    },
    {
      icon: Search,
      title: "Smart Learning",
      description: "AI-powered recommendations personalize your learning journey"
    },
    {
      icon: ListCheck,
      title: "AI Quizzes",
      description: "Intelligent assessments that adapt difficulty based on your progress"
    },
    {
      icon: LayoutDashboard,
      title: "Leaderboard",
      description: "Gamified learning with achievements and friendly competition"
    },
    {
      icon: Calendar,
      title: "Progress Tracker",
      description: "Visual analytics showing your learning milestones and growth"
    },
    {
      icon: MessageCircle,
      title: "AI Tutor",
      description: "24/7 intelligent assistant for instant doubt clarification"
    },
    {
      icon: FileText,
      title: "Homework Support",
      description: "Upload assignments and get AI-powered feedback and guidance"
    },
    {
      icon: User,
      title: "AI Career Counsellor",
      description: "Personalized career guidance based on your skills and interests"
    },
    {
      icon: BookUser,
      title: "Voice Agent",
      description: "Real-time voice interactions for natural learning conversations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EduAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The Future of Learning is Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience AI-powered education that adapts to you. Join thousands of students already learning smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Sign up with Google
            </Button>
          </div>
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              10,000+ Active Students
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              500+ Schools
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              98% Success Rate
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powered by AI, Designed for Success</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-first approach revolutionizes education with personalized learning experiences
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the AI learning revolution. Start your personalized education journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">EduAI</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 EduAI. All rights reserved. Powered by AI, designed for learners.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
