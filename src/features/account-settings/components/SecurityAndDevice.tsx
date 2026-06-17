
import { MonitorSmartphone, Laptop, Smartphone, ChevronDown, ChevronRight } from 'lucide-react';
import { ToggleSwitch } from '../../website-management/components/shared/ToggleSwitch';

export function SecurityAndDevice() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
          <MonitorSmartphone size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">Security & Device</h3>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5">The security checkup of your account</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* 2 Step Verification */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">2 Step Verification</h4>
            <p className="text-sm text-slate-500 mt-1">Activated on phone 123********89 since 20 May, 2026</p>
          </div>
          <ToggleSwitch defaultChecked={true} />
        </div>

        {/* Device & Active Sessions */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <div className="p-5 bg-amber-50/30">
            <h4 className="text-[15px] font-bold text-amber-900 mb-4">Your Device & active sessions</h4>
            
            <div className="space-y-3">
              {/* Windows Device - Expanded */}
              <div className="border border-amber-200 rounded-lg bg-amber-50/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Laptop size={18} className="text-amber-700" />
                    <span className="font-bold text-amber-900 text-[15px]">Windows device - Active now</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer">
                    2 sessions on Windows computer(s)
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="space-y-2 pl-7">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span className="text-amber-800"><span className="text-amber-600 font-medium">Last login:</span> May 27 - 09:14 am</span>
                      <span className="text-amber-800"><span className="text-amber-600 font-medium">IP Address:</span> 192.168.1.45</span>
                    </div>
                    <span className="text-amber-800"><span className="text-amber-600 font-medium">Session Due:</span> 12m 34s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span className="text-amber-800"><span className="text-amber-600 font-medium">Last login:</span> May 25 - 11:24 pm</span>
                      <span className="text-amber-800"><span className="text-amber-600 font-medium">IP Address:</span> 192.168.0.43</span>
                    </div>
                    <span className="text-amber-800"><span className="text-amber-600 font-medium">Session Due:</span> 45m 34s</span>
                  </div>
                </div>
              </div>

              {/* IOS Device - Collapsed */}
              <div className="border border-amber-200 rounded-lg bg-amber-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-amber-700" />
                    <span className="font-bold text-amber-900 text-[15px]">IOS device</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer">
                    1 sessions on IOS iPhone(s)
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          Update Password
        </button>
      </div>
    </div>
  );
}
