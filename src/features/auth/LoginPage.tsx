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
import { requestLogin, requestSendOtp, requestResendOtp } from '@/api/endpoints/auth.api';
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
  const [challengeId, setChallengeId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  type LoginFormInputs = LoginCredentials & { method: 'EMAIL' | 'SMS' };

  const formStep1 = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      method: 'EMAIL',
    }
  });

  const formStep2 = useForm<OtpFormInputs>({
    defaultValues: {
      otp: '',
    }
  });

  const onSubmitStep1: SubmitHandler<LoginFormInputs> = async (data) => {
    dispatch(clearError());
    setRequestError(null);
    setIsRequesting(true);
    try {
      const loginRes = await requestLogin({ email: data.email, password: data.password });
      
      const userId = loginRes.data?.userId;
      
      if (loginRes.data?.challengeId || loginRes.data?.status === 'OTP_REQUIRED') {
        setUserId(userId);
        
      
        const loginChallengeId = loginRes.data?.challengeId;
        
        if (loginChallengeId && data.method === 'EMAIL') {
          setChallengeId(loginChallengeId);
        } else {
          const otpRes = await requestSendOtp({
            userId,
            purpose: 'LOGIN',
            method: data.method
          });
          setChallengeId(otpRes.data.challengeId);
        }
        
        setStep(2);
        toast.success(`OTP sent successfully to your ${data.method === 'SMS' ? 'phone' : 'email'}`);
      } else {
        toast.error('Unexpected login status: ' + (loginRes.data?.status || 'Unknown'));
      }
    } catch (err: unknown) {
      const error = err as import('axios').AxiosError<{ message: string }>;
      setRequestError(error.response?.data?.message || error.message || 'Failed to login and request OTP');
      toast.error('Failed to login and request OTP');
    } finally {
      setIsRequesting(false);
    }
  };

  const onSubmitStep2: SubmitHandler<OtpFormInputs> = async (data) => {
    dispatch(clearError());
    try {
      await dispatch(login({ challengeId, otp: data.otp })).unwrap();
      routerNavigate({ to: '/dashboard' });
      toast.success('Logged in successfully');
    } catch {
      // Error is handled by the thunk and stored in state
    }
  };

  const handleResendOtp = async () => {
    dispatch(clearError());
    setIsResending(true);
    try {
      await requestResendOtp({
        challengeId,
        userId,
        purpose: 'LOGIN'
      });
      toast.success('OTP resent successfully');
    } catch (err: unknown) {
      const error = err as import('axios').AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-primaryBg flex items-center justify-center p-4 relative overflow-hidden w-full">
      {/* Background elegant elements */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-0 -right-10 w-96 h-96 bg-[#D8E2FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      
      <div className="w-full max-w-[620px] relative z-10 flex flex-col items-center">
        <Card className="w-full border-0 bg-[url('/images/Login.png')] bg-cover bg-center shadow-2xl relative overflow-hidden min-h-[708px] flex flex-col justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 w-full px-4 sm:px-12">
            <CardHeader className="space-y-1 pb-8 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
              <CardDescription className="text-white/80 font-medium">
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
                    <Label htmlFor="email" className="text-white font-bold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
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
                        className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm backdrop-blur-md" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white font-bold">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                      <Input 
                        id="password" 
                        {...formStep1.register('password', {
                          required: 'Password is required'
                        })}
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm backdrop-blur-md" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 h-5 w-5 text-white/60 hover:text-white transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="method" className="text-white font-bold">OTP Method</Label>
                    <div className="relative">
                      <select
                        id="method"
                        {...formStep1.register('method')}
                        className="w-full h-11 rounded-md bg-white/10 border border-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm px-3 backdrop-blur-md appearance-none"
                      >
                        <option value="EMAIL" className="bg-slate-800 text-white">Email</option>
                        <option value="PHONE" className="bg-slate-800 text-white">SMS</option>
                      </select>
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
                    <Label htmlFor="otp" className="text-white font-bold">One Time Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                      <Input 
                        id="otp" 
                        {...formStep2.register('otp', {
                          required: 'OTP is required'
                        })}
                        type="text" 
                        placeholder="Enter OTP" 
                        className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white focus-visible:border-white transition-all shadow-sm tracking-widest backdrop-blur-md" 
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
                  <div className="flex flex-col items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-sm font-bold text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isResending ? <><Loader2 className="h-4 w-4 animate-spin" /> Resending...</> : 'Resend OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}