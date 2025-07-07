import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookUser, LayoutDashboard, ListCheck, MessageCircle, User, Calendar, FileText, Search } from "lucide-react";
const Index = () => {
  const features = [{
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Engage with dynamic, multimedia content that adapts to your learning style",
    gradient: "from-blue-500 to-cyan-500"
  }, {
    icon: Search,
    title: "Smart Learning",
    description: "AI-powered recommendations personalize your learning journey",
    gradient: "from-purple-500 to-pink-500"
  }, {
    icon: ListCheck,
    title: "AI Quizzes",
    description: "Intelligent assessments that adapt difficulty based on your progress",
    gradient: "from-green-500 to-emerald-500"
  }, {
    icon: LayoutDashboard,
    title: "Leaderboard",
    description: "Gamified learning with achievements and friendly competition",
    gradient: "from-orange-500 to-red-500"
  }, {
    icon: Calendar,
    title: "Progress Tracker",
    description: "Visual analytics showing your learning milestones and growth",
    gradient: "from-indigo-500 to-purple-500"
  }, {
    icon: MessageCircle,
    title: "AI Tutor",
    description: "24/7 intelligent assistant for instant doubt clarification",
    gradient: "from-teal-500 to-cyan-500"
  }, {
    icon: FileText,
    title: "Homework Support",
    description: "Upload assignments and get AI-powered feedback and guidance",
    gradient: "from-rose-500 to-pink-500"
  }, {
    icon: User,
    title: "AI Career Counsellor",
    description: "Personalized career guidance based on your skills and interests",
    gradient: "from-violet-500 to-purple-500"
  }, {
    icon: BookUser,
    title: "Voice Agent",
    description: "Real-time voice interactions for natural learning conversations",
    gradient: "from-amber-500 to-orange-500"
  }];
  return <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-glow/20 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Edgenius</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 border-white/20">Login</Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 animate-pulse-glow">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-primary-glow font-medium mb-6">
              🚀 The Future of Education
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            AI-Powered Learning<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Revolution</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience personalized education with our AI-first LMS. Smart lessons, instant feedback, and career guidance that adapts to your unique learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="text-xl px-12 py-8 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105">
              <BookOpen className="mr-3 h-6 w-6" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-12 py-8 border-white/30 backdrop-blur-sm text-zinc-50 bg-violet-600 hover:bg-violet-500">
              <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-lg text-gray-400">
            <div className="flex items-center backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              10,000+ Active Students
            </div>
            <div className="flex items-center backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              500+ Schools
            </div>
            <div className="flex items-center backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
              98% Success Rate
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powered by AI, Designed for Success
          </h2>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
            Discover how our AI-first approach revolutionizes education with personalized learning experiences
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="group relative overflow-hidden border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-white transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-lg text-gray-300 group-hover:text-gray-200 transition-colors">{feature.description}</CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-2xl">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join the AI learning revolution. Start your personalized education journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 border-white/30 text-white backdrop-blur-sm bg-violet-500 hover:bg-violet-400">Talk to our Expert</Button>
            </div>
            <p className="text-gray-400 text-lg">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">EduAI</span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors text-lg">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors text-lg">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors text-lg">Contact</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-lg">
            © 2024 EduAI. All rights reserved. Powered by AI, designed for learners.
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;