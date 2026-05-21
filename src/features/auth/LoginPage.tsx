import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail } from 'lucide-react';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-primaryBg flex items-center justify-center p-4 relative overflow-hidden w-full">
      {/* Background elegant elements */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-0 -right-10 w-96 h-96 bg-[#D8E2FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-2">
          <img src="/images/AdminLogo.png" alt="Admin Logo" className="h-16 w-auto" />
        </div>

        <Card className="w-full border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-1 pb-8 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-slate-700 font-bold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand focus-visible:border-brand transition-all shadow-sm" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
                  <a href="#" className="text-sm font-bold text-brand hover:text-brand-hover transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand focus-visible:border-brand transition-all shadow-sm" 
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-bold text-base transition-all duration-300 shadow-md shadow-brand/20">
                Sign In
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
