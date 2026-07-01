import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { clearError, setOtpPending, setCredentials } from '@/store/slices/authSlice';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { requestLogin } from '@/api/endpoints/auth.api';
import { toast } from 'sonner';
import type { LoginCredentials } from '@/types/auth.types';

type LoginFormInputs = LoginCredentials;

export default function LoginPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isRequesting, setIsRequesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formStep1 = useForm<LoginFormInputs>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    dispatch(clearError());
    setIsRequesting(true);
    try {
      const loginRes = await requestLogin({ email: data.email, password: data.password });

      if (loginRes.data?.status === 'OTP_REQUIRED') {
        dispatch(setOtpPending({
          userId: loginRes.data.userId!,
          challengeId: null,
          method: 'EMAIL',
          purpose: 'LOGIN',
          email: loginRes.data.email || data.email,
          phone: loginRes.data.phone || null,
        }));

        toast.success(loginRes.message || 'Credentials verified. Choose how to receive your OTP.');
        routerNavigate({ to: '/receive-otp' });
      } else if (loginRes.data?.accessToken && loginRes.data?.user) {
        dispatch(setCredentials({
          user: loginRes.data.user,
          accessToken: loginRes.data.accessToken,
        }));

        toast.success(loginRes.message || 'Login successful');
        routerNavigate({ to: '/dashboard' });
      } else {
        toast.success(loginRes.message || 'Login successful');
        routerNavigate({ to: '/dashboard' });
      }
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to login');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[500px]">

        {/* ── Card ── */}
        <div className="relative text-white rounded-[28px] shadow-2xl overflow-hidden border border-white/10 flex flex-col p-7 sm:p-9 min-h-[580px]">

          {/* BG image */}
          <img
            src="/footer.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ zIndex: 0 }}
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.12)', zIndex: 1 }}
          />

          {/* Content */}
          <div className="relative flex flex-col h-full w-full" style={{ zIndex: 2 }}>

            <div className="text-center mb-7">
              <div className="flex justify-center mb-3">
                <img
                  src="/images/logo-dash.png"
                  alt="WeightLossMD & Wellness"
                  className="h-14 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-3">Welcome Back</h2>
              <p className="text-xs text-white/65 mt-1">Sign in to manage the platform.</p>
            </div>

            <form onSubmit={formStep1.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-200">
                    Email Address
                  </label>
                  <input
                    {...formStep1.register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' },
                    })}
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full bg-white/10 border ${formStep1.formState.errors.email ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-white/30'} rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-all duration-200 text-sm`}
                  />
                  {formStep1.formState.errors.email && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-400 pl-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium">{formStep1.formState.errors.email.message}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-200">Password</label>
                  <div className="relative">
                    <input
                      {...formStep1.register('password', { required: 'Password is required' })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`w-full bg-white/10 border ${formStep1.formState.errors.password ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-white/30'} rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-all duration-200 text-sm pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formStep1.formState.errors.password && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-400 pl-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium">{formStep1.formState.errors.password.message}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isRequesting}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isRequesting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                  ) : (
                    <>Login <span className="text-base">→</span></>
                  )}
                </button>
                <div className="text-center pt-3.5">
                  <button
                    type="button"
                    onClick={() => routerNavigate({ to: '/forgot-password' })}
                    className="text-xs font-light text-white/75 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
