import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { requestForgotPassword } from '@/api/endpoints/auth.api';

export default function ForgotPasswordPage() {
  const routerNavigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await requestForgotPassword({ email });
      toast.success(res.message || 'Verification code sent to your email');
      routerNavigate({ to: '/' });
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Something went wrong. Please try again.');
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
                  onClick={() => routerNavigate({ to: '/' })}
                  className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">Forgot Password</h2>
              <p className="text-xs text-white/65 mt-1 leading-relaxed max-w-xs mx-auto mb-8">
                Enter your registered email and we'll send you a verification code.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
              <div className="flex-grow mb-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full bg-white/10 border border-white/10 rounded-xl pl-11 pr-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Checking account…</>
                  ) : (
                    <>Continue <span className="text-base">→</span></>
                  )}
                </button>

         
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
