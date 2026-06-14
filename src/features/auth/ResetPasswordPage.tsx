import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearOtpPending } from '@/store/slices/authSlice';
import { requestResetPassword } from '@/api/endpoints/auth.api';

export default function ResetPasswordPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();
  const otpPending = useAppSelector((state) => state.auth.otpPending);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordMismatch = !!confirmPassword && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!otpPending?.challengeId) {
      toast.error('Session expired. Please start again.');
      routerNavigate({ to: '/forgot-password' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestResetPassword({
        challengeId: otpPending.challengeId,
        newPassword,
        confirmPassword,
      });
      toast.success(res.message || 'Password reset successfully.');
      dispatch(clearOtpPending());
      routerNavigate({ to: '/' });
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
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
                  onClick={() => routerNavigate({ to: '/verify-otp' })}
                  className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">Reset Password</h2>
              <p className="text-xs text-white/65 mt-1 leading-relaxed max-w-xs mx-auto">
                Enter your new password below. Make sure it's strong and memorable.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
              <div className="space-y-4 flex-grow">

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-200">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-white/10 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-200">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`w-full bg-white/10 border rounded-xl pl-11 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-all duration-200 text-sm ${
                        passwordMismatch
                          ? 'border-red-400/60 focus:border-red-400'
                          : 'border-white/10 focus:border-white/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || passwordMismatch}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Resetting…</>
                  ) : (
                    <>Reset Password <span className="text-base">→</span></>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => routerNavigate({ to: '/' })}
                    className="text-xs font-light text-white/75 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Back to Login
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
