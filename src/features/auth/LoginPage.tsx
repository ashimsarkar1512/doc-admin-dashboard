import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { requestLoginOtp } from '@/api/endpoints/auth.api';
import { toast } from 'sonner';
import type { LoginCredentials } from '@/types/auth.types';

type OtpFormInputs = {
  otp: string;
};

export default function LoginPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const formStep1 = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const formStep2 = useForm<OtpFormInputs>({
    defaultValues: {
      otp: '',
    }
  });

  const onSubmitStep1: SubmitHandler<LoginCredentials> = async (data) => {
    dispatch(clearError());
    setRequestError(null);
    setIsRequesting(true);
    try {
      await requestLoginOtp(data);
      setUserEmail(data.email);
      setStep(2);
      toast.success('OTP sent successfully to your email');
    } catch (err: unknown) {
      const error = err as import('axios').AxiosError<{ message: string }>;
      setRequestError(error.response?.data?.message || error.message || 'Failed to request OTP');
      toast.error('Failed to request OTP');
    } finally {
      setIsRequesting(false);
    }
  };

  const onSubmitStep2: SubmitHandler<OtpFormInputs> = async (data) => {
    dispatch(clearError());
    try {
      await dispatch(login({ email: userEmail, otp: data.otp })).unwrap();
      routerNavigate({ to: '/dashboard' });
      toast.success('Logged in successfully');
    } catch {
      // Error is handled by the thunk and stored in state
    }
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
              {step === 1 ? 'Enter your credentials to access your dashboard' : 'Enter the OTP sent to your email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm font-medium">
                {error}
              </div>
            )}
            {requestError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm font-medium">
                {requestError}
              </div>
            )}
            
            {step === 1 ? (
              <form onSubmit={formStep1.handleSubmit(onSubmitStep1)} className="space-y-5">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-slate-700 font-bold">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                      id="email" 
                      {...formStep1.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      type="email" 
                      placeholder="admin@example.com" 
                      className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand focus-visible:border-brand transition-all shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                      id="password" 
                      {...formStep1.register('password', {
                        required: 'Password is required'
                      })}
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand focus-visible:border-brand transition-all shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isRequesting}
                  className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-bold text-base transition-all duration-300 shadow-md shadow-brand/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isRequesting ? <><Loader2 className="h-5 w-5 animate-spin" /> Requesting OTP...</> : 'Login'}
                </Button>
              </form>
            ) : (
              <form onSubmit={formStep2.handleSubmit(onSubmitStep2)} className="space-y-5">
                <div className="space-y-2 text-left">
                  <Label htmlFor="otp" className="text-slate-700 font-bold">One Time Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                      id="otp" 
                      {...formStep2.register('otp', {
                        required: 'OTP is required'
                      })}
                      type="text" 
                      placeholder="Enter OTP" 
                      className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-brand focus-visible:border-brand transition-all shadow-sm tracking-widest" 
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-bold text-base transition-all duration-300 shadow-md shadow-brand/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</> : 'Verify & Sign In'}
                </Button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-bold text-slate-500 hover:text-brand transition-colors cursor-pointer"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}