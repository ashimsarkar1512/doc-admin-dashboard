import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';import { requestLogin, requestResendOtp } from '@/api/endpoints/auth.api';
import { toast } from 'sonner';
import type { LoginCredentials } from '@/types/auth.types';

type Step = 1 | 2;
type LoginFormInputs = LoginCredentials;

export default function LoginPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<Step>(1);
  const [challengeId, setChallengeId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formStep1 = useForm<LoginFormInputs>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmitStep1: SubmitHandler<LoginFormInputs> = async (data) => {
    dispatch(clearError());
    setIsRequesting(true);
    try {
      const loginRes = await requestLogin({ email: data.email, password: data.password });
      setUserId(loginRes.data?.userId);
      if (loginRes.data?.challengeId) setChallengeId(loginRes.data.challengeId);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to login');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    dispatch(clearError());
    try {
      await dispatch(login({ challengeId, otp: otpString })).unwrap();
      routerNavigate({ to: '/dashboard' });
      toast.success('Logged in successfully');
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Verification failed');
    }
  };

  const handleResendOtp = async () => {
    dispatch(clearError());
    setIsResending(true);
    try {
      await requestResendOtp({ challengeId, userId, purpose: 'LOGIN' });
      toast.success('OTP resent successfully');
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[500px]">

        {/* ── Card ── */}
        <div className="relative text-white rounded-[24px] shadow-2xl overflow-hidden border border-white/10 flex flex-col p-7 sm:p-9 min-h-[580px]">

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

            {/* ── STEP 1: Login ── */}
            {step === 1 && (
              <>
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

                <form
                  onSubmit={formStep1.handleSubmit(onSubmitStep1)}
                  className="flex flex-col flex-grow"
                >
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-200">
                        Email Address
                      </label>
                      <input
                        {...formStep1.register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                        })}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-200">Password</label>
                      <div className="relative">
                        <input
                          {...formStep1.register('password', { required: 'Password is required' })}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isRequesting}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
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
              </>
            )}

            {/* ── STEP 2: Verify OTP ── */}
            {step === 2 && (
              <>
                <div className="text-center mb-7">
                  <div className="flex justify-center mb-3">
                    <img
                      src="/images/logo-dash.png"
                      alt="WeightLossMD & Wellness"
                      className="h-14 w-auto object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>

                  <div className="flex justify-center mt-4 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp(['', '', '', '', '', '']);
                        dispatch(clearError());
                      }}
                      className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-white">Verify Authentication</h2>
                  <p className="text-xs text-white/65 mt-1 leading-relaxed">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="space-y-1.5 flex-grow">
                    <label className="block text-xs font-semibold text-gray-200">Enter OTP</label>
                    <div className="flex gap-2 justify-between mt-1">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className="flex-1 h-12 text-center text-white text-lg font-semibold bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isLoading || otp.join('').length < 6}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                      ) : (
                        <>Verify Authentication <span className="text-base">→</span></>
                      )}
                    </button>
                    <div className="text-center pt-3.5">
                      <p className="text-xs text-white/55">Didn't receive the code?</p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-xs font-light text-white/75 hover:text-white transition-colors underline underline-offset-4 cursor-pointer disabled:opacity-50 mt-0.5"
                      >
                        {isResending ? (
                          <span className="flex items-center gap-1 justify-center">
                            <Loader2 className="h-3 w-3 animate-spin" /> Resending…
                          </span>
                        ) : 'Resend'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
