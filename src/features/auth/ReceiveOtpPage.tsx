import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOtpPending } from '@/store/slices/authSlice';
import { requestSendOtp } from '@/api/endpoints/auth.api';

type Method = 'EMAIL' | 'SMS';

export default function ReceiveOtpPage() {
  const routerNavigate = useNavigate();
  const dispatch = useAppDispatch();
  const otpPending = useAppSelector((state) => state.auth.otpPending);

  const [method, setMethod] = useState<Method>('EMAIL');
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpPending?.userId) {
      toast.error('Session expired. Please log in again.');
      routerNavigate({ to: '/' });
      return;
    }

    setIsSending(true);
    try {
      const res = await requestSendOtp({
        userId: otpPending.userId,
        purpose: otpPending.purpose,
        method,
      });
      dispatch(setOtpPending({
        userId: otpPending.userId,
        challengeId: res.data.challengeId,
        method,
        purpose: otpPending.purpose,
      }));
      toast.success(res.message || `OTP sent to your ${method === 'SMS' ? 'phone' : 'email'}`);
      routerNavigate({ to: '/verify-otp' });
    } catch (err: unknown) {
      const e = err as import('axios').AxiosError<{ message: string }>;
      toast.error(e.response?.data?.message || e.message || 'Failed to send OTP');
    } finally {
      setIsSending(false);
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

              <div className="flex justify-center mt-4 mb-4">
                <button
                  type="button"
                  onClick={() => routerNavigate({ to: '/' })}
                  className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">Receive OTP Code</h2>
              <p className="text-xs text-white/65 mt-1">Choose the option to receive the code</p>
            </div>

            <form onSubmit={handleSendCode} className="flex flex-col flex-grow">
              <div className="space-y-3 flex-grow">

                {/* Email option */}
                <label
                  className={`flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 border cursor-pointer transition-all duration-200 ${
                    method === 'EMAIL'
                      ? 'border-white/30 bg-white/15'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      method === 'EMAIL'
                        ? 'border-[#2563eb] bg-[#2563eb]'
                        : 'border-white/40 bg-transparent'
                    }`}
                  >
                    {method === 'EMAIL' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="method"
                    value="EMAIL"
                    checked={method === 'EMAIL'}
                    onChange={() => setMethod('EMAIL')}
                    className="sr-only"
                  />
                  <span className="text-sm text-white/85">Email: ex*****@email.com</span>
                </label>

                {/* Phone option */}
                <label
                  className={`flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 border cursor-pointer transition-all duration-200 ${
                    method === 'SMS'
                      ? 'border-white/30 bg-white/15'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      method === 'SMS'
                        ? 'border-[#2563eb] bg-[#2563eb]'
                        : 'border-white/40 bg-transparent'
                    }`}
                  >
                    {method === 'SMS' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="method"
                    value="SMS"
                    checked={method === 'SMS'}
                    onChange={() => setMethod('SMS')}
                    className="sr-only"
                  />
                  <span className="text-sm text-white/85">Phone: +123*******90</span>
                </label>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                  ) : (
                    <>Send Code <span className="text-base">→</span></>
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
