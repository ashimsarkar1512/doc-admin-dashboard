// import React, { useState } from 'react';
// import { Save, Upload } from 'lucide-react';

// // ─── Reusable atoms ────────────────────────────────────────────────────────────

// interface FieldProps {
//   label: string;
//   id: string;
//   type?: string;
//   defaultValue?: string;
//   placeholder?: string;
//   className?: string;
// }

// function Field({ label, id, type = 'text', defaultValue = '', placeholder = '', className = '' }: FieldProps) {
//   return (
//     <div className={className}>
//       <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
//         {label}
//       </label>
//       <input
//         id={id}
//         type={type}
//         defaultValue={defaultValue}
//         placeholder={placeholder}
//         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//       />
//     </div>
//   );
// }

// interface ToggleProps {
//   checked?: boolean;
//   onChange?: (v: boolean) => void;
// }

// function Toggle({ checked = true, onChange }: ToggleProps) {
//   const [on, setOn] = useState(checked);
//   return (
//     <button
//       role="switch"
//       aria-checked={on}
//       onClick={() => { setOn(!on); onChange?.(!on); }}
//       className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${on ? 'bg-[#1447E6]' : 'bg-slate-200'}`}
//     >
//       <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
//     </button>
//   );
// }

// // ─── Upload Box ────────────────────────────────────────────────────────────────

// interface UploadBoxProps {
//   label: string;
//   sublabel?: string;
//   dark?: boolean;
//   aspectClass?: string;
// }

// function UploadBox({ label, sublabel, dark = false, aspectClass = 'h-36' }: UploadBoxProps) {
//   return (
//     <div>
//       <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
//       {sublabel && <p className="text-xs text-slate-400 mb-2">{sublabel}</p>}
//       <div
//         className={`${aspectClass} rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 ${dark ? 'bg-[#1A2340]' : 'bg-slate-50'}`}
//       >
//         <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition">
//           <Upload size={13} /> Upload
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Section heading ───────────────────────────────────────────────────────────

// function SectionHeading({ children }: { children: React.ReactNode }) {
//   return <h3 className="text-base font-bold text-slate-800 mb-4">{children}</h3>;
// }

// function Divider() {
//   return <hr className="border-slate-200 my-7" />;
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function SiteSettingsPage() {
//   return (
//     <div className="w-full bg-white min-h-full font-sans">
//       <div className="px-8 py-6 pb-20">

//         {/* Top Save */}
//         <div className="flex justify-end mb-6">
//           <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
//             <Save size={15} /> Save Changes
//           </button>
//         </div>

//         {/* ── Site Settings ───────────────────────────────────────────── */}
//         <SectionHeading>Site Settings (shaikot)</SectionHeading>

//         {/* Site Title */}
//         <div className="mb-4">
//           <label htmlFor="site-title" className="block text-sm font-medium text-slate-700 mb-1.5">Site Title:</label>
//           <input
//             id="site-title"
//             type="text"
//             defaultValue="Weight Loss MD"
//             className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//           />
//         </div>

//         {/* Meta Description + Preview */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="meta-desc" className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description:</label>
//             <textarea
//               id="meta-desc"
//               rows={5}
//               defaultValue="Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges"
//               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//           </div>

//           {/* SERP Preview */}
//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1.5">Preview</p>
//             <div className="border border-slate-200 rounded-lg p-4 bg-white">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">W</div>
//                 <div>
//                   <p className="text-xs font-medium text-slate-700 leading-none">Weight Loss MD</p>
//                   <p className="text-[10px] text-slate-400">https://weightlossmd.com</p>
//                 </div>
//               </div>
//               <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">Weight Loss MD</p>
//               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//                 Power is a slick, high-converting SaaS landing page template designed for AI-powered startups, with modern design. Write about your practice here...
//               </p>
//             </div>
//           </div>
//         </div>

//         <Divider />

//         {/* ── Site Images ─────────────────────────────────────────────── */}
//         <SectionHeading>Site Images</SectionHeading>

//         {/* Logos row */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <UploadBox
//             label="Foster White Logo"
//             sublabel="Upload your website logo (recommended: 200x68px)"
//             dark={true}
//             aspectClass="h-40"
//           />
//           <UploadBox
//             label="Header Colored Logo"
//             sublabel="Upload your website logo (recommended: 200x68px)"
//             dark={false}
//             aspectClass="h-40"
//           />
//         </div>

//         {/* Favicon + Social Preview */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1">Favicon</p>
//             <p className="text-xs text-slate-400 mb-2">64 × 64 pixels</p>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs text-slate-500 mb-1.5">Light</p>
//                 <div className="h-28 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
//                   <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition">
//                     <Upload size={12} /> Upload
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 mb-1.5">Dark</p>
//                 <div className="h-28 rounded-lg border border-slate-200 bg-[#1A2340] flex items-center justify-center">
//                   <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-md shadow-sm hover:bg-white/20 transition">
//                     <Upload size={12} /> Upload
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1">Social Preview</p>
//             <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>
//             <div className="h-28 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/80" />
//               <button className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-md shadow-sm hover:bg-white/20 transition">
//                 <Upload size={12} /> Upload
//               </button>
//             </div>
//           </div>
//         </div>

//         <Divider />

//         {/* ── Office address ──────────────────────────────────────────── */}
//         <SectionHeading>Office address</SectionHeading>

//         {[
//           { label: 'Office one', name: 'Colorado Springs', address: '1625 Medical Center Point, Suite 150, Colorado Springs, CO 80907' },
//           { label: 'Office two', name: 'Cherry Creek', address: '700 E Speer Blvd, Denver, CO 80203' },
//           { label: 'Office three', name: 'DTC / Greenwood Village', address: '8100 E Union Ave, Suite 104, Denver, CO 80237' },
//           { label: 'Office four', name: 'Boulder', address: '2425 Canyon Blvd, Suite G, Boulder, CO 80302' },
//         ].map((office, i) => (
//           <div key={i} className="grid grid-cols-2 gap-4 mb-3">
//             <div>
//               <div className="flex items-center gap-2 mb-1.5">
//                 <span className="text-sm font-medium text-slate-700">{office.label}</span>
//                 <Toggle checked={true} />
//               </div>
//               <input
//                 defaultValue={office.name}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//               />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700 mb-1.5">Address:</p>
//               <input
//                 defaultValue={office.address}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//               />
//             </div>
//           </div>
//         ))}

//         <Divider />

//         {/* ── Contact info ────────────────────────────────────────────── */}
//         <SectionHeading>Contact info</SectionHeading>

//         <div className="grid grid-cols-2 gap-4 mb-3">
//           <Field id="phone" label="Phone number:" placeholder="(720) 279-1164" defaultValue="(720) 279-1164" />
//           <Field id="email" label="Email:" placeholder="info@wlmd.net" defaultValue="info@wlmd.net" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Field id="opening" label="Opening:" defaultValue="Mon - Fri: 9AM - 3PM, 3PM - 6PM" />
//           <Field id="offday" label="Off day:" defaultValue="Sat - Sun" />
//         </div>

//         <Divider />

//         {/* ── Social Links ─────────────────────────────────────────────── */}
//         <SectionHeading>Social Links</SectionHeading>

//         <div className="grid grid-cols-2 gap-4 mb-3">
//           <Field id="facebook" label="Facebook:" placeholder="https://" />
//           <Field id="instagram" label="Instagram:" placeholder="https://" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Field id="twitter" label="Twitter:" placeholder="https://" />
//           <Field id="linkedin" label="LinkedIn:" placeholder="https://" />
//         </div>

//         <Divider />

//         {/* ── Google Analytics ─────────────────────────────────────────── */}
//         <SectionHeading>Google Analytics</SectionHeading>
//         <p className="text-sm text-slate-500 mb-4 leading-relaxed">
//           Directly integrate Google Analytics into your site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR.
//         </p>

//         <div>
//           <label htmlFor="ga-id" className="block text-sm font-medium text-slate-700 mb-1.5">Measurement ID:</label>
//           <div className="flex gap-2">
//             <input
//               id="ga-id"
//               type="text"
//               placeholder="G-XXXXXXXXXX"
//               className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//             <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition">
//               Apply
//             </button>
//           </div>
//         </div>

//         {/* Bottom Save */}
//         <div className="mt-8">
//           <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
//             <Save size={15} /> Save Changes
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


// this are more fixed code 


// import React, { useEffect, useState } from 'react';
// import { Save, Upload, Loader2 } from 'lucide-react';
// // import { getWebsiteSettings } from '@/api/endpoints/websitemanagement.api ';
// import {
//   getWebsiteSettings,
//   updateWebsiteSettings,
//   type WebsiteSettings,
//   type OfficeInput,
//   type SocialLinkInput,
// } from '@/api/endpoints/websitemanagement.api';

// // ─── Reusable atoms ────────────────────────────────────────────────────────────

// interface FieldProps {
//   label: string;
//   id: string;
//   type?: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   className?: string;
// }

// function Field({ label, id, type = 'text', value, onChange, placeholder = '', className = '' }: FieldProps) {
//   return (
//     <div className={className}>
//       <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
//         {label}
//       </label>
//       <input
//         id={id}
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//       />
//     </div>
//   );
// }

// interface ToggleProps {
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }

// function Toggle({ checked, onChange }: ToggleProps) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#1447E6]' : 'bg-slate-200'}`}
//     >
//       <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
//     </button>
//   );
// }

// // ─── Upload Box ────────────────────────────────────────────────────────────────

// interface UploadBoxProps {
//   label: string;
//   sublabel?: string;
//   dark?: boolean;
//   aspectClass?: string;
//   previewUrl?: string | null;
//   onFileSelected: (file: File) => void;
// }

// function UploadBox({ label, sublabel, dark = false, aspectClass = 'h-36', previewUrl, onFileSelected }: UploadBoxProps) {
//   const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

//   return (
//     <div>
//       <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
//       {sublabel && <p className="text-xs text-slate-400 mb-2">{sublabel}</p>}
//       <div
//         className={`${aspectClass} rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 relative overflow-hidden ${dark ? 'bg-[#1A2340]' : 'bg-slate-50'}`}
//       >
//         {previewUrl && (
//           <img
//             src={previewUrl}
//             alt={label}
//             className="absolute inset-0 w-full h-full object-contain p-3"
//           />
//         )}
//         <input
//           id={inputId}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) onFileSelected(file);
//           }}
//         />
//         <label
//           htmlFor={inputId}
//           className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition cursor-pointer z-10"
//         >
//           <Upload size={13} /> Upload
//         </label>
//       </div>
//     </div>
//   );
// }

// // ─── Section heading ───────────────────────────────────────────────────────────

// function SectionHeading({ children }: { children: React.ReactNode }) {
//   return <h3 className="text-base font-bold text-slate-800 mb-4">{children}</h3>;
// }

// function Divider() {
//   return <hr className="border-slate-200 my-7" />;
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// const PLATFORM_KEYS: Array<SocialLinkInput['platform']> = [
//   'facebook',
//   'instagram',
//   'twitter',
//   'linkedin',
// ];

// export default function SiteSettingsPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Core fields
//   const [title, setTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [openHours, setOpenHours] = useState('');
//   const [closedDays, setClosedDays] = useState('');
//   const [gaMeasurementId, setGaMeasurementId] = useState('');

//   // Existing image URLs (for preview) + newly selected files (to upload)
//   const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(null);
//   const [blackLogoUrl, setBlackLogoUrl] = useState<string | null>(null);
//   const [faviconLightUrl, setFaviconLightUrl] = useState<string | null>(null);
//   const [faviconDarkUrl, setFaviconDarkUrl] = useState<string | null>(null);
//   const [socialPreviewUrl, setSocialPreviewUrl] = useState<string | null>(null);

//   const [whiteLogoFile, setWhiteLogoFile] = useState<File | null>(null);
//   const [blackLogoFile, setBlackLogoFile] = useState<File | null>(null);
//   const [faviconLightFile, setFaviconLightFile] = useState<File | null>(null);
//   const [faviconDarkFile, setFaviconDarkFile] = useState<File | null>(null);
//   const [socialPreviewFile, setSocialPreviewFile] = useState<File | null>(null);

//   // Offices & social links
//   const [offices, setOffices] = useState<OfficeInput[]>([]);
//   const [socialLinks, setSocialLinks] = useState<SocialLinkInput[]>([]);
// const data = getWebsiteSettings();
// console.log(data); 
//   // ── Load settings on mount ──────────────────────────────────────────────
//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data: WebsiteSettings = await getWebsiteSettings();
//         if (!isMounted) return;

//         setTitle(data.title ?? '');
//         setMetaDescription(data.metaDescription ?? '');
//         setPhone(data.phone ?? '');
//         setEmail(data.email ?? '');
//         setOpenHours(data.openHours ?? '');
//         setClosedDays(data.closedDays ?? '');
//         setGaMeasurementId(data.gaMeasurementId ?? '');

//         setWhiteLogoUrl(data.whiteLogoUrl ?? null);
//         setBlackLogoUrl(data.blackLogoUrl ?? null);
//         setFaviconLightUrl(data.faviconLightUrl ?? null);
//         setFaviconDarkUrl(data.faviconDarkUrl ?? null);
//         setSocialPreviewUrl(data.socialPreviewUrl ?? null);

//         setOffices(
//           (data.offices ?? []).map((office) => ({
//             id: office.id,
//             name: office.name,
//             address: office.address,
//             city: office.city,
//             state: office.state,
//             zipCode: office.zipCode,
//             isActive: office.isActive,
//             facebookUrl: office.facebookUrl ?? '',
//             instagramUrl: office.instagramUrl ?? '',
//             twitterUrl: office.twitterUrl ?? '',
//             linkedinUrl: office.linkedinUrl ?? '',
//           }))
//         );

//         // Ensure all 4 platform rows exist even if backend has fewer
//         const existingLinks = data.socialLinks ?? [];
//         const merged = PLATFORM_KEYS.map((platform) => {
//           const found = existingLinks.find((l) => l.platform === platform);
//           return found
//             ? { id: found.id, platform: found.platform, url: found.url }
//             : { platform, url: '' };
//         });
//         setSocialLinks(merged);
//       } catch (err) {
//         if (isMounted) setError('Failed to load website settings.');
//         console.error(err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // ── Office field updater ────────────────────────────────────────────────
//   const updateOffice = (index: number, patch: Partial<OfficeInput>) => {
//     setOffices((prev) =>
//       prev.map((office, i) => (i === index ? { ...office, ...patch } : office))
//     );
//   };

//   // ── Social link field updater ───────────────────────────────────────────
//   const updateSocialLink = (platform: string, url: string) => {
//     setSocialLinks((prev) =>
//       prev.map((link) => (link.platform === platform ? { ...link, url } : link))
//     );
//   };

//   const getSocialUrl = (platform: string) =>
//     socialLinks.find((l) => l.platform === platform)?.url ?? '';

//   // ── Save handler ─────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setError(null);

//       const updated = await updateWebsiteSettings({
//         title,
//         metaDescription,
//         phone,
//         email,
//         openHours,
//         closedDays,
//         gaMeasurementId,
//         offices,
//         socialLinks: socialLinks.filter((l) => l.url.trim() !== ''),
//         ...(whiteLogoFile && { whiteLogo: whiteLogoFile }),
//         ...(blackLogoFile && { blackLogo: blackLogoFile }),
//         ...(faviconLightFile && { faviconLight: faviconLightFile }),
//         ...(faviconDarkFile && { faviconDark: faviconDarkFile }),
//         ...(socialPreviewFile && { socialPreview: socialPreviewFile }),
//       });

//       // Sync state with server response (new image URLs, etc.)
//       setWhiteLogoUrl(updated.whiteLogoUrl ?? null);
//       setBlackLogoUrl(updated.blackLogoUrl ?? null);
//       setFaviconLightUrl(updated.faviconLightUrl ?? null);
//       setFaviconDarkUrl(updated.faviconDarkUrl ?? null);
//       setSocialPreviewUrl(updated.socialPreviewUrl ?? null);

//       setWhiteLogoFile(null);
//       setBlackLogoFile(null);
//       setFaviconLightFile(null);
//       setFaviconDarkFile(null);
//       setSocialPreviewFile(null);
//     } catch (err) {
//       setError('Failed to save changes. Please try again.');
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full bg-white min-h-full flex items-center justify-center py-20">
//         <Loader2 className="animate-spin text-slate-400" size={28} />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-white min-h-full font-sans">
//       <div className="px-8 py-6 pb-20">

//         {error && (
//           <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
//             {error}
//           </div>
//         )}

//         {/* Top Save */}
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>

//         {/* ── Site Settings ───────────────────────────────────────────── */}
//         <SectionHeading>Site Settings (shaikot)</SectionHeading>

//         <div className="mb-4">
//           <label htmlFor="site-title" className="block text-sm font-medium text-slate-700 mb-1.5">Site Title:</label>
//           <input
//             id="site-title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="meta-desc" className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description:</label>
//             <textarea
//               id="meta-desc"
//               rows={5}
//               value={metaDescription}
//               onChange={(e) => setMetaDescription(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//           </div>

//           {/* SERP Preview */}
//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1.5">Preview</p>
//             <div className="border border-slate-200 rounded-lg p-4 bg-white">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
//                   {title.charAt(0).toUpperCase() || 'W'}
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-slate-700 leading-none">{title || 'Site Title'}</p>
//                   <p className="text-[10px] text-slate-400">https://weightlossmd.com</p>
//                 </div>
//               </div>
//               <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">{title || 'Site Title'}</p>
//               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//                 {metaDescription || 'Write about your practice here...'}
//               </p>
//             </div>
//           </div>
//         </div>

//         <Divider />

//         {/* ── Site Images ─────────────────────────────────────────────── */}
//         <SectionHeading>Site Images</SectionHeading>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <UploadBox
//             label="Foster White Logo"
//             sublabel="Upload your website logo (recommended: 200x68px)"
//             dark={true}
//             aspectClass="h-40"
//             previewUrl={whiteLogoFile ? URL.createObjectURL(whiteLogoFile) : whiteLogoUrl}
//             onFileSelected={setWhiteLogoFile}
//           />
//           <UploadBox
//             label="Header Colored Logo"
//             sublabel="Upload your website logo (recommended: 200x68px)"
//             dark={false}
//             aspectClass="h-40"
//             previewUrl={blackLogoFile ? URL.createObjectURL(blackLogoFile) : blackLogoUrl}
//             onFileSelected={setBlackLogoFile}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1">Favicon</p>
//             <p className="text-xs text-slate-400 mb-2">64 × 64 pixels</p>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs text-slate-500 mb-1.5">Light</p>
//                 <UploadBox
//                   label="Favicon Light"
//                   dark={false}
//                   aspectClass="h-28"
//                   previewUrl={faviconLightFile ? URL.createObjectURL(faviconLightFile) : faviconLightUrl}
//                   onFileSelected={setFaviconLightFile}
//                 />
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 mb-1.5">Dark</p>
//                 <UploadBox
//                   label="Favicon Dark"
//                   dark={true}
//                   aspectClass="h-28"
//                   previewUrl={faviconDarkFile ? URL.createObjectURL(faviconDarkFile) : faviconDarkUrl}
//                   onFileSelected={setFaviconDarkFile}
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1">Social Preview</p>
//             <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>
//             <UploadBox
//               label="Social Preview"
//               dark={true}
//               aspectClass="h-28"
//               previewUrl={socialPreviewFile ? URL.createObjectURL(socialPreviewFile) : socialPreviewUrl}
//               onFileSelected={setSocialPreviewFile}
//             />
//           </div>
//         </div>

//         <Divider />

//         {/* ── Office address ──────────────────────────────────────────── */}
//         <SectionHeading>Office address</SectionHeading>

//         {offices.map((office, i) => (
//           <div key={office.id ?? i} className="grid grid-cols-2 gap-4 mb-3">
//             <div>
//               <div className="flex items-center gap-2 mb-1.5">
//                 <span className="text-sm font-medium text-slate-700">Office {i + 1}</span>
//                 <Toggle
//                   checked={office.isActive}
//                   onChange={(v) => updateOffice(i, { isActive: v })}
//                 />
//               </div>
//               <input
//                 value={office.name}
//                 onChange={(e) => updateOffice(i, { name: e.target.value })}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//               />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700 mb-1.5">Address:</p>
//               <input
//                 value={office.address}
//                 onChange={(e) => updateOffice(i, { address: e.target.value })}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//               />
//             </div>
//           </div>
//         ))}

//         <Divider />

//         {/* ── Contact info ────────────────────────────────────────────── */}
//         <SectionHeading>Contact info</SectionHeading>

//         <div className="grid grid-cols-2 gap-4 mb-3">
//           <Field id="phone" label="Phone number:" value={phone} onChange={setPhone} placeholder="(720) 279-1164" />
//           <Field id="email" label="Email:" value={email} onChange={setEmail} placeholder="info@wlmd.net" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Field id="opening" label="Opening:" value={openHours} onChange={setOpenHours} />
//           <Field id="offday" label="Off day:" value={closedDays} onChange={setClosedDays} />
//         </div>

//         <Divider />

//         {/* ── Social Links ─────────────────────────────────────────────── */}
//         <SectionHeading>Social Links</SectionHeading>

//         <div className="grid grid-cols-2 gap-4 mb-3">
//           <Field
//             id="facebook"
//             label="Facebook:"
//             placeholder="https://"
//             value={getSocialUrl('facebook')}
//             onChange={(v) => updateSocialLink('facebook', v)}
//           />
//           <Field
//             id="instagram"
//             label="Instagram:"
//             placeholder="https://"
//             value={getSocialUrl('instagram')}
//             onChange={(v) => updateSocialLink('instagram', v)}
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Field
//             id="twitter"
//             label="Twitter:"
//             placeholder="https://"
//             value={getSocialUrl('twitter')}
//             onChange={(v) => updateSocialLink('twitter', v)}
//           />
//           <Field
//             id="linkedin"
//             label="LinkedIn:"
//             placeholder="https://"
//             value={getSocialUrl('linkedin')}
//             onChange={(v) => updateSocialLink('linkedin', v)}
//           />
//         </div>

//         <Divider />

//         {/* ── Google Analytics ─────────────────────────────────────────── */}
//         <SectionHeading>Google Analytics</SectionHeading>
//         <p className="text-sm text-slate-500 mb-4 leading-relaxed">
//           Directly integrate Google Analytics into your site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR.
//         </p>

//         <div>
//           <label htmlFor="ga-id" className="block text-sm font-medium text-slate-700 mb-1.5">Measurement ID:</label>
//           <div className="flex gap-2">
//             <input
//               id="ga-id"
//               type="text"
//               value={gaMeasurementId}
//               onChange={(e) => setGaMeasurementId(e.target.value)}
//               placeholder="G-XXXXXXXXXX"
//               className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//           </div>
//         </div>

//         {/* Bottom Save */}
//         <div className="mt-8">
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


// add here upload imge defrent api 


import React, { useEffect, useState } from 'react';
import { Save, Upload, Loader2 } from 'lucide-react';
// import axiosInstance from '@/lib/axiosInstance'; // adjust path if different in your project
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  type WebsiteSettings,
  type OfficeInput,
  type SocialLinkInput,
} from '@/api/endpoints/websitemanagement.api';
import { axiosInstance } from '@/api/axiosInstance';

// ─── Reusable atoms ────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

function Field({ label, id, type = 'text', value, onChange, placeholder = '', className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
      />
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#1447E6]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

// ─── Upload Box ────────────────────────────────────────────────────────────────

interface UploadBoxProps {
  label: string;
  sublabel?: string;
  dark?: boolean;
  aspectClass?: string;
  previewUrl?: string | null;
  onFileSelected: (file: File) => void;
}

function UploadBox({ label, sublabel, dark = false, aspectClass = 'h-36', previewUrl, onFileSelected }: UploadBoxProps) {
  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mb-2">{sublabel}</p>}
      <div
        className={`${aspectClass} rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 relative overflow-hidden ${dark ? 'bg-[#1A2340]' : 'bg-slate-50'}`}
      >
        {previewUrl && (
          <img
            src={previewUrl}
            alt={label}
            className="absolute inset-0 w-full h-full object-contain p-3"
          />
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
          }}
        />
        <label
          htmlFor={inputId}
          className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition cursor-pointer z-10"
        >
          <Upload size={13} /> Upload
        </label>
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

// ─── Attachment upload helper ──────────────────────────────────────────────────
// Uploads a single file to the attachments endpoint and returns the new attachment id.
// Adjust the `context` values below to match your backend's actual enum.
async function uploadAttachment(file: File, context: string): Promise<string> {
  const formData = new FormData();
  formData.append('context', context);
  formData.append('files', file);

  const response = await axiosInstance.post('/attachments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (response.data?.success) {
    return response.data.data.id;
  }
  throw new Error(response.data?.message || 'Image upload failed');
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PLATFORM_KEYS: Array<SocialLinkInput['platform']> = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
];

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core fields
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [closedDays, setClosedDays] = useState('');
  const [gaMeasurementId, setGaMeasurementId] = useState('');

  // Existing image URLs (for preview) + newly selected files (to upload)
  const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(null);
  const [blackLogoUrl, setBlackLogoUrl] = useState<string | null>(null);
  const [faviconLightUrl, setFaviconLightUrl] = useState<string | null>(null);
  const [faviconDarkUrl, setFaviconDarkUrl] = useState<string | null>(null);
  const [socialPreviewUrl, setSocialPreviewUrl] = useState<string | null>(null);

  const [whiteLogoFile, setWhiteLogoFile] = useState<File | null>(null);
  const [blackLogoFile, setBlackLogoFile] = useState<File | null>(null);
  const [faviconLightFile, setFaviconLightFile] = useState<File | null>(null);
  const [faviconDarkFile, setFaviconDarkFile] = useState<File | null>(null);
  const [socialPreviewFile, setSocialPreviewFile] = useState<File | null>(null);

  // Offices & social links
  const [offices, setOffices] = useState<OfficeInput[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkInput[]>([]);

  // ── Load settings on mount ──────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data: WebsiteSettings = await getWebsiteSettings();
        if (!isMounted) return;

        setTitle(data.title ?? '');
        setMetaDescription(data.metaDescription ?? '');
        setPhone(data.phone ?? '');
        setEmail(data.email ?? '');
        setOpenHours(data.openHours ?? '');
        setClosedDays(data.closedDays ?? '');
        setGaMeasurementId(data.gaMeasurementId ?? '');

        setWhiteLogoUrl(data.whiteLogoUrl ?? null);
        setBlackLogoUrl(data.blackLogoUrl ?? null);
        setFaviconLightUrl(data.faviconLightUrl ?? null);
        setFaviconDarkUrl(data.faviconDarkUrl ?? null);
        setSocialPreviewUrl(data.socialPreviewUrl ?? null);

        setOffices(
          (data.offices ?? []).map((office) => ({
            id: office.id,
            name: office.name,
            address: office.address,
            city: office.city,
            state: office.state,
            zipCode: office.zipCode,
            isActive: office.isActive,
            facebookUrl: office.facebookUrl ?? '',
            instagramUrl: office.instagramUrl ?? '',
            twitterUrl: office.twitterUrl ?? '',
            linkedinUrl: office.linkedinUrl ?? '',
          }))
        );

        // Ensure all 4 platform rows exist even if backend has fewer
        const existingLinks = data.socialLinks ?? [];
        const merged = PLATFORM_KEYS.map((platform) => {
          const found = existingLinks.find((l) => l.platform === platform);
          return found
            ? { id: found.id, platform: found.platform, url: found.url }
            : { platform, url: '' };
        });
        setSocialLinks(merged);
      } catch (err) {
        if (isMounted) setError('Failed to load website settings.');
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Office field updater ────────────────────────────────────────────────
  const updateOffice = (index: number, patch: Partial<OfficeInput>) => {
    setOffices((prev) =>
      prev.map((office, i) => (i === index ? { ...office, ...patch } : office))
    );
  };

  // ── Social link field updater ───────────────────────────────────────────
  const updateSocialLink = (platform: string, url: string) => {
    setSocialLinks((prev) =>
      prev.map((link) => (link.platform === platform ? { ...link, url } : link))
    );
  };

  const getSocialUrl = (platform: string) =>
    socialLinks.find((l) => l.platform === platform)?.url ?? '';

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // 1. Upload any newly selected files first — backend wants attachment
      //    ids in the settings payload, not raw files.
      const [whiteLogoId, blackLogoId, faviconLightId, faviconDarkId, socialPreviewId] =
        await Promise.all([
          whiteLogoFile ? uploadAttachment(whiteLogoFile, 'LOGO') : Promise.resolve(undefined),
          blackLogoFile ? uploadAttachment(blackLogoFile, 'LOGO') : Promise.resolve(undefined),
          faviconLightFile ? uploadAttachment(faviconLightFile, 'FAVICON') : Promise.resolve(undefined),
          faviconDarkFile ? uploadAttachment(faviconDarkFile, 'FAVICON') : Promise.resolve(undefined),
          socialPreviewFile ? uploadAttachment(socialPreviewFile, 'SOCIAL_PREVIEW') : Promise.resolve(undefined),
        ]);

      // 2. Send plain JSON with ids (not files) to the settings endpoint
      const updated = await updateWebsiteSettings({
        title,
        metaDescription,
        phone,
        email,
        openHours,
        closedDays,
        gaMeasurementId,
        offices,
        socialLinks: socialLinks.filter((l) => l.url.trim() !== ''),
        ...(whiteLogoId && { whiteLogoId }),
        ...(blackLogoId && { blackLogoId }),
        ...(faviconLightId && { faviconLightId }),
        ...(faviconDarkId && { faviconDarkId }),
        ...(socialPreviewId && { socialPreviewId }),
      });

      // Sync state with server response (new image URLs, etc.)
      setWhiteLogoUrl(updated.whiteLogoUrl ?? null);
      setBlackLogoUrl(updated.blackLogoUrl ?? null);
      setFaviconLightUrl(updated.faviconLightUrl ?? null);
      setFaviconDarkUrl(updated.faviconDarkUrl ?? null);
      setSocialPreviewUrl(updated.socialPreviewUrl ?? null);

      setWhiteLogoFile(null);
      setBlackLogoFile(null);
      setFaviconLightFile(null);
      setFaviconDarkFile(null);
      setSocialPreviewFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-full flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-slate-400" size={28} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-full font-sans">
      <div className="px-8 py-6 pb-20">

        {error && (
          <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Top Save */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* ── Site Settings ───────────────────────────────────────────── */}
        <SectionHeading>Site Settings (shaikot)</SectionHeading>

        <div className="mb-4">
          <label htmlFor="site-title" className="block text-sm font-medium text-slate-700 mb-1.5">Site Title:</label>
          <input
            id="site-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meta-desc" className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description:</label>
            <textarea
              id="meta-desc"
              rows={5}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
            />
          </div>

          {/* SERP Preview */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1.5">Preview</p>
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                  {title.charAt(0).toUpperCase() || 'W'}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700 leading-none">{title || 'Site Title'}</p>
                  <p className="text-[10px] text-slate-400">https://weightlossmd.com</p>
                </div>
              </div>
              <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">{title || 'Site Title'}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {metaDescription || 'Write about your practice here...'}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Site Images ─────────────────────────────────────────────── */}
        <SectionHeading>Site Images</SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UploadBox
            label="Foster White Logo"
            sublabel="Upload your website logo (recommended: 200x68px)"
            dark={true}
            aspectClass="h-40"
            previewUrl={whiteLogoFile ? URL.createObjectURL(whiteLogoFile) : whiteLogoUrl}
            onFileSelected={setWhiteLogoFile}
          />
          <UploadBox
            label="Header Colored Logo"
            sublabel="Upload your website logo (recommended: 200x68px)"
            dark={false}
            aspectClass="h-40"
            previewUrl={blackLogoFile ? URL.createObjectURL(blackLogoFile) : blackLogoUrl}
            onFileSelected={setBlackLogoFile}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Favicon</p>
            <p className="text-xs text-slate-400 mb-2">64 × 64 pixels</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Light</p>
                <UploadBox
                  label="Favicon Light"
                  dark={false}
                  aspectClass="h-28"
                  previewUrl={faviconLightFile ? URL.createObjectURL(faviconLightFile) : faviconLightUrl}
                  onFileSelected={setFaviconLightFile}
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Dark</p>
                <UploadBox
                  label="Favicon Dark"
                  dark={true}
                  aspectClass="h-28"
                  previewUrl={faviconDarkFile ? URL.createObjectURL(faviconDarkFile) : faviconDarkUrl}
                  onFileSelected={setFaviconDarkFile}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Social Preview</p>
            <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>
            <UploadBox
              label="Social Preview"
              dark={true}
              aspectClass="h-28"
              previewUrl={socialPreviewFile ? URL.createObjectURL(socialPreviewFile) : socialPreviewUrl}
              onFileSelected={setSocialPreviewFile}
            />
          </div>
        </div>

        <Divider />

        {/* ── Office address ──────────────────────────────────────────── */}
        <SectionHeading>Office address</SectionHeading>

        {offices.map((office, i) => (
          <div key={office.id ?? i} className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-slate-700">Office {i + 1}</span>
                <Toggle
                  checked={office.isActive}
                  onChange={(v) => updateOffice(i, { isActive: v })}
                />
              </div>
              <input
                value={office.name}
                onChange={(e) => updateOffice(i, { name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1.5">Address:</p>
              <input
                value={office.address}
                onChange={(e) => updateOffice(i, { address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
              />
            </div>
          </div>
        ))}

        <Divider />

        {/* ── Contact info ────────────────────────────────────────────── */}
        <SectionHeading>Contact info</SectionHeading>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Field id="phone" label="Phone number:" value={phone} onChange={setPhone} placeholder="(720) 279-1164" />
          <Field id="email" label="Email:" value={email} onChange={setEmail} placeholder="info@wlmd.net" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field id="opening" label="Opening:" value={openHours} onChange={setOpenHours} />
          <Field id="offday" label="Off day:" value={closedDays} onChange={setClosedDays} />
        </div>

        <Divider />

        {/* ── Social Links ─────────────────────────────────────────────── */}
        <SectionHeading>Social Links</SectionHeading>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Field
            id="facebook"
            label="Facebook:"
            placeholder="https://"
            value={getSocialUrl('facebook')}
            onChange={(v) => updateSocialLink('facebook', v)}
          />
          <Field
            id="instagram"
            label="Instagram:"
            placeholder="https://"
            value={getSocialUrl('instagram')}
            onChange={(v) => updateSocialLink('instagram', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            id="twitter"
            label="Twitter:"
            placeholder="https://"
            value={getSocialUrl('twitter')}
            onChange={(v) => updateSocialLink('twitter', v)}
          />
          <Field
            id="linkedin"
            label="LinkedIn:"
            placeholder="https://"
            value={getSocialUrl('linkedin')}
            onChange={(v) => updateSocialLink('linkedin', v)}
          />
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
              value={gaMeasurementId}
              onChange={(e) => setGaMeasurementId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
            />
          </div>
        </div>

        {/* Bottom Save */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}