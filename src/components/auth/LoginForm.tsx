import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Mail, Lock, UserCheck, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onLogin: (user: { name: string; role: string; email: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Get user profile and role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', authData.user.id)
          .single();

        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id)
          .single();

        if (profileError || roleError) {
          throw new Error('Failed to load user profile');
        }

        onLogin({
          name: profile?.full_name || authData.user.email?.split('@')[0] || 'User',
          role: userRole?.role || 'radiologist',
          email: authData.user.email || ''
        });

        toast({
          title: "Login Successful",
          description: `Welcome back to NeuroVision Assist!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
      
      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'radiologist', label: 'Radiologist' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'specialist_patient', label: 'Specialist' },
    { value: 'receptionist', label: 'Receptionist' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md medical-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold medical-gradient-text">
              NeuroVision Assist
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {activeTab === 'login' ? 'Sign in to access your medical dashboard' : 'Create your medical professional account'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="medical" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Dr. John Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupRole" className="text-sm font-medium">Medical Role</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="pl-10 medical-input">
                        <SelectValue placeholder="Select your medical role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((roleItem) => (
                          <SelectItem key={roleItem.value} value={roleItem.value}>
                            {roleItem.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="medical" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;