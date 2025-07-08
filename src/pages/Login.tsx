import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-hero opacity-40 animate-gradient bg-[length:400%_400%]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-glow/20 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Edgenius</span>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome to Edgenius</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Button 
                    onClick={handleGoogleSignIn} 
                    disabled={isLoading}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Button 
                    onClick={handleGoogleSignIn} 
                    disabled={isLoading}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isLoading ? 'Signing up...' : 'Sign up with Google'}
                  </Button>
                  
                  <p className="text-sm text-gray-300 text-center mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}