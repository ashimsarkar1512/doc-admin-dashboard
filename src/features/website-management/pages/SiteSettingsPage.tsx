import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';

// ─── Reusable atoms ────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

function Field({ label, id, type = 'text', defaultValue = '', placeholder = '', className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
      />
    </div>
  );
}

interface ToggleProps {
  checked?: boolean;
  onChange?: (v: boolean) => void;
}

function Toggle({ checked = true, onChange }: ToggleProps) {
  const [on, setOn] = useState(checked);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => { setOn(!on); onChange?.(!on); }}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${on ? 'bg-[#1447E6]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

// ─── Upload Box ────────────────────────────────────────────────────────────────

interface UploadBoxProps {
  label: string;
  sublabel?: string;
  dark?: boolean;
  aspectClass?: string;
}

function UploadBox({ label, sublabel, dark = false, aspectClass = 'h-36' }: UploadBoxProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mb-2">{sublabel}</p>}
      <div
        className={`${aspectClass} rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 ${dark ? 'bg-[#1A2340]' : 'bg-slate-50'}`}
      >
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition">
          <Upload size={13} /> Upload
        </button>
      </div>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-slate-800 mb-4">{children}</h3>;
}

function Divider() {
  return <hr className="border-slate-200 my-7" />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  return (
    <div className="w-full bg-white min-h-full font-sans">
      <div className="px-8 py-6 pb-20">

        {/* Top Save */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Save size={15} /> Save Changes
          </button>
        </div>

        {/* ── Site Settings ───────────────────────────────────────────── */}
        <SectionHeading>Site Settings</SectionHeading>

        {/* Site Title */}
        <div className="mb-4">
          <label htmlFor="site-title" className="block text-sm font-medium text-slate-700 mb-1.5">Site Title:</label>
          <input
            id="site-title"
            type="text"
            defaultValue="Weight Loss MD"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
          />
        </div>

        {/* Meta Description + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meta-desc" className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description:</label>
            <textarea
              id="meta-desc"
              rows={5}
              defaultValue="Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
            />
          </div>

          {/* SERP Preview */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1.5">Preview</p>
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">W</div>
                <div>
                  <p className="text-xs font-medium text-slate-700 leading-none">Weight Loss MD</p>
                  <p className="text-[10px] text-slate-400">https://weightlossmd.com</p>
                </div>
              </div>
              <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">Weight Loss MD</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Power is a slick, high-converting SaaS landing page template designed for AI-powered startups, with modern design. Write about your practice here...
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Site Images ─────────────────────────────────────────────── */}
        <SectionHeading>Site Images</SectionHeading>

        {/* Logos row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UploadBox
            label="Foster White Logo"
            sublabel="Upload your website logo (recommended: 200x68px)"
            dark={true}
            aspectClass="h-40"
          />
          <UploadBox
            label="Header Colored Logo"
            sublabel="Upload your website logo (recommended: 200x68px)"
            dark={false}
            aspectClass="h-40"
          />
        </div>

        {/* Favicon + Social Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Favicon</p>
            <p className="text-xs text-slate-400 mb-2">64 × 64 pixels</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Light</p>
                <div className="h-28 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition">
                    <Upload size={12} /> Upload
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Dark</p>
                <div className="h-28 rounded-lg border border-slate-200 bg-[#1A2340] flex items-center justify-center">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-md shadow-sm hover:bg-white/20 transition">
                    <Upload size={12} /> Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Social Preview</p>
            <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>
            <div className="h-28 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/80" />
              <button className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-md shadow-sm hover:bg-white/20 transition">
                <Upload size={12} /> Upload
              </button>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Office address ──────────────────────────────────────────── */}
        <SectionHeading>Office address</SectionHeading>

        {[
          { label: 'Office one', name: 'Colorado Springs', address: '1625 Medical Center Point, Suite 150, Colorado Springs, CO 80907' },
          { label: 'Office two', name: 'Cherry Creek', address: '700 E Speer Blvd, Denver, CO 80203' },
          { label: 'Office three', name: 'DTC / Greenwood Village', address: '8100 E Union Ave, Suite 104, Denver, CO 80237' },
          { label: 'Office four', name: 'Boulder', address: '2425 Canyon Blvd, Suite G, Boulder, CO 80302' },
        ].map((office, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-slate-700">{office.label}</span>
                <Toggle checked={true} />
              </div>
              <input
                defaultValue={office.name}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1.5">Address:</p>
              <input
                defaultValue={office.address}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
              />
            </div>
          </div>
        ))}

        <Divider />

        {/* ── Contact info ────────────────────────────────────────────── */}
        <SectionHeading>Contact info</SectionHeading>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Field id="phone" label="Phone number:" placeholder="(720) 279-1164" defaultValue="(720) 279-1164" />
          <Field id="email" label="Email:" placeholder="info@wlmd.net" defaultValue="info@wlmd.net" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field id="opening" label="Opening:" defaultValue="Mon - Fri: 9AM - 3PM, 3PM - 6PM" />
          <Field id="offday" label="Off day:" defaultValue="Sat - Sun" />
        </div>

        <Divider />

        {/* ── Social Links ─────────────────────────────────────────────── */}
        <SectionHeading>Social Links</SectionHeading>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Field id="facebook" label="Facebook:" placeholder="https://" />
          <Field id="instagram" label="Instagram:" placeholder="https://" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field id="twitter" label="Twitter:" placeholder="https://" />
          <Field id="linkedin" label="LinkedIn:" placeholder="https://" />
        </div>

        <Divider />

        {/* ── Google Analytics ─────────────────────────────────────────── */}
        <SectionHeading>Google Analytics</SectionHeading>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Directly integrate Google Analytics into your site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR.
        </p>

        <div>
          <label htmlFor="ga-id" className="block text-sm font-medium text-slate-700 mb-1.5">Measurement ID:</label>
          <div className="flex gap-2">
            <input
              id="ga-id"
              type="text"
              placeholder="G-XXXXXXXXXX"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
            />
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition">
              Apply
            </button>
          </div>
        </div>

        {/* Bottom Save */}
        <div className="mt-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Save size={15} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
