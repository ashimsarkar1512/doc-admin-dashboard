import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearOtpPending, setOtpPending } from '@/store/slices/authSlice';
import { requestResendOtp } from '@/api/endpoints/auth.api';

export default function VerifyOtpPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();
  const otpPending = useAppSelector((state) => state.auth.otpPending);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── OTP input handlers ──────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digitsOnly = e.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!digitsOnly) return;
    const newOtp = [...otp];
    for (let i = 0; i < digitsOnly.length; i++) newOtp[i] = digitsOnly[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
  };

  // ── Submit OTP ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      toast.error('Please enter the full 6-digit code.');
      return;
    }

    if (!otpPending?.challengeId) {
      toast.error('Session expired. Please log in again.');
      routerNavigate({ to: '/' });
      return;
    }

    // ── FORGOT_PASSWORD flow: just verify OTP, then go to reset page ──
    if (otpPending.purpose === 'FORGOT_PASSWORD') {
      try {
        const { verifyForgotPasswordOtp } = await import('@/api/endpoints/auth.api');
        const res = await verifyForgotPasswordOtp({
          challengeId: otpPending.challengeId,
          otp: otpCode,
        });
        // Store new challengeId returned after verify (used for reset-password)
        dispatch(setOtpPending({
          ...otpPending,
          challengeId: res.data?.challengeId ?? otpPending.challengeId,
        }));
        toast.success(res.message || 'OTP verified. Set your new password.');
        routerNavigate({ to: '/reset-password' });
      } catch (err: unknown) {
        const e = err as import('axios').AxiosError<{ message: string }>;
        toast.error(e.response?.data?.message || e.message || 'Invalid OTP. Please try again.');
      }
      return;
    }

    // ── LOGIN flow ──
    const result = await dispatch(
      login({ challengeId: otpPending.challengeId, otp: otpCode })
    );

    if (login.fulfilled.match(result)) {
      toast.success(result.payload.message || 'OTP verified successfully.');
      dispatch(clearOtpPending());
      routerNavigate({ to: '/dashboard' });
    } else {
      const message =
        typeof result.payload === 'string'
          ? result.payload
          : 'Invalid OTP. Please try again.';
      toast.error(message);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!otpPending?.userId || !otpPending?.challengeId) {
      toast.error('Session expired. Please log in again.');
      routerNavigate({ to: '/' });
      return;
    }

    setIsResending(true);
    try {
      const res = await requestResendOtp({
        challengeId: otpPending.challengeId,
        userId: otpPending.userId,
        purpose: otpPending.purpose,
      });

      // Backend may issue a new challengeId on resend — always update it
      const newChallengeId = res.data?.challengeId ?? otpPending.challengeId;
      dispatch(setOtpPending({ ...otpPending, challengeId: newChallengeId }));

      toast.success(res.message || 'OTP resent successfully.');
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const methodLabel = otpPending?.method === 'SMS' ? 'phone' : 'email';

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

            {/* Header */}
            <div className="text-center mb-7">
              <div className="flex justify-center mb-3">
                <img
                  src="/images/logo-dash.png"
                  alt="WeightLossMD & Wellness"
                  className="h-14 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              {/* Back button */}
              <div className="flex justify-center mt-4 mb-4">
                <button
                  type="button"
                  onClick={() => routerNavigate({ to: '/receive-otp' })}
                  className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                Verify Authentication
              </h2>
              <p className="text-xs text-white/65 mt-1 leading-relaxed max-w-xs mx-auto">
                Enter the 6-digit code sent to your {methodLabel}.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
              <div className="flex-grow">
                <label className="block text-xs font-semibold text-gray-200 mb-3">
                  Enter OTP
                </label>

                {/* OTP inputs */}
                <div className="flex justify-between gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      placeholder="-"
                      className="flex-1 min-w-0 aspect-square max-h-14 bg-white/10 border border-white/10 rounded-xl text-center text-lg text-white font-semibold placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-200"
                    />
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="mt-6 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                  ) : (
                    <>Verify Authentication <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <div className="flex flex-col items-center gap-1.5 text-xs text-center">
                  <span className="text-white/65 font-light">Didn&apos;t receive the code?</span>
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={handleResend}
                    className="text-white font-medium hover:text-gray-200 transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    {isResending ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                    ) : (
                      'Resend'
                    )}
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
