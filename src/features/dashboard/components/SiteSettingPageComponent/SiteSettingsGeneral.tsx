// import { useEffect, useState } from "react";
// import { Upload } from "lucide-react";
// // import { updateSiteSettings } from '@/api/endpoints/websitemanagement.api';
// import { uploadAttachment } from "@/api/endpoints/attachments.api";
// import { updateSiteSettings } from "@/api/endpoints/websitemanagement.api";
// import { toast } from "sonner";

// type Props = {
//   infoData: any;
// };

// function Divider() {
//   return <hr className="border-slate-200 my-7" />;
// }

// // ─────────────────────────────────────────────
// // UploadBox (MUST be outside render)
// // ─────────────────────────────────────────────
// function UploadBox({
//   label,
//   sublabel,
//   dark = false,
//   aspectClass = "h-36",
//   previewUrl,
//   onFileSelected,
// }: {
//   label: string;
//   sublabel?: string;
//   dark?: boolean;
//   aspectClass?: string;
//   previewUrl?: string | null;
//   onFileSelected: (file: File) => void;
// }) {
//   const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

//   return (
//     <div>
//       <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>

//       {sublabel && <p className="text-xs text-slate-400 mb-2">{sublabel}</p>}

//       <div
//         className={`${aspectClass} rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 relative overflow-hidden ${
//           dark ? "bg-[#1A2340]" : "bg-slate-50"
//         }`}
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

// // ─────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────
// export default function SiteSettingsGeneral({ infoData }: Props) {
//   const [title, setTitle] = useState("");
//   const [metaDescription, setMetaDescription] = useState("");

//   // ── new files picked by user (not yet uploaded) ──
//   const [whiteLogoFile, setWhiteLogoFile] = useState<File | null>(null);
//   const [blackLogoFile, setBlackLogoFile] = useState<File | null>(null);
//   const [faviconLightFile, setFaviconLightFile] = useState<File | null>(null);
//   const [faviconDarkFile, setFaviconDarkFile] = useState<File | null>(null);
//   const [socialPreviewFile, setSocialPreviewFile] = useState<File | null>(null);

//   // ── existing urls from backend (synced on load + after save) ──
//   const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(null);
//   const [blackLogoUrl, setBlackLogoUrl] = useState<string | null>(null);
//   const [faviconLightUrl, setFaviconLightUrl] = useState<string | null>(null);
//   const [faviconDarkUrl, setFaviconDarkUrl] = useState<string | null>(null);
//   const [socialPreviewUrl, setSocialPreviewUrl] = useState<string | null>(null);

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!infoData) return;
//     setTitle(infoData.title || "");
//     setMetaDescription(infoData.metaDescription || "");

//     setWhiteLogoUrl(infoData.whiteLogo?.fileUrl ?? null);
//     setBlackLogoUrl(infoData.blackLogo?.fileUrl ?? null);
//     setFaviconLightUrl(infoData.faviconLight?.fileUrl ?? null);
//     setFaviconDarkUrl(infoData.faviconDark?.fileUrl ?? null);
//     setSocialPreviewUrl(infoData.socialPreview?.fileUrl ?? null);
//   }, [infoData]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setError(null);

//       // 1. Upload any newly picked files first — backend wants attachment
//       //    ids in the settings payload, not raw files.
//       const [
//         whiteLogoAttachment,
//         blackLogoAttachment,
//         faviconLightAttachment,
//         faviconDarkAttachment,
//         socialPreviewAttachment,
//       ] = await Promise.all([
//         whiteLogoFile
//           ? uploadAttachment(whiteLogoFile, "PRODUCT_IMAGE")
//           : Promise.resolve(undefined),
//         blackLogoFile
//           ? uploadAttachment(blackLogoFile, "PRODUCT_IMAGE")
//           : Promise.resolve(undefined),
//         faviconLightFile
//           ? uploadAttachment(faviconLightFile, "PRODUCT_IMAGE")
//           : Promise.resolve(undefined),
//         faviconDarkFile
//           ? uploadAttachment(faviconDarkFile, "PRODUCT_IMAGE")
//           : Promise.resolve(undefined),
//         socialPreviewFile
//           ? uploadAttachment(socialPreviewFile, "PRODUCT_IMAGE")
//           : Promise.resolve(undefined),
//       ]);

//       // 2. Send plain JSON with ids (not files) to the settings endpoint
//       const payload = {
//         title,
//         metaDescription,
//         ...(whiteLogoAttachment && { whiteLogoId: whiteLogoAttachment.id }),
//         ...(blackLogoAttachment && { blackLogoId: blackLogoAttachment.id }),
//         ...(faviconLightAttachment && {
//           faviconLightId: faviconLightAttachment.id,
//         }),
//         ...(faviconDarkAttachment && {
//           faviconDarkId: faviconDarkAttachment.id,
//         }),
//         ...(socialPreviewAttachment && {
//           socialPreviewId: socialPreviewAttachment.id,
//         }),
//       };

//       console.log("🚀 Payload:", payload);

//       const updated = await updateSiteSettings(payload);
//       console.log(updated);
//       // here
//       toast.success("Settings updated successfully 🚀");
//       // 3. Sync state with server response (new image urls etc.)
//       setWhiteLogoUrl(updated.whiteLogo?.fileUrl ?? whiteLogoUrl);
//       setBlackLogoUrl(updated.blackLogo?.fileUrl ?? blackLogoUrl);
//       setFaviconLightUrl(updated.faviconLight?.fileUrl ?? faviconLightUrl);
//       setFaviconDarkUrl(updated.faviconDark?.fileUrl ?? faviconDarkUrl);
//       setSocialPreviewUrl(updated.socialPreview?.fileUrl ?? socialPreviewUrl);

//       setWhiteLogoFile(null);
//       setBlackLogoFile(null);
//       setFaviconLightFile(null);
//       setFaviconDarkFile(null);
//       setSocialPreviewFile(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to save changes. Please try again.");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       {/* ── EXACT YOUR DESIGN ───────────────────────────── */}

//       <div className="mb-4">
//         <label
//           htmlFor="site-title"
//           className="block text-sm font-medium text-slate-700 mb-1.5"
//         >
//           Site Title:
//         </label>
//         <input
//           id="site-title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="meta-desc"
//             className="block text-sm font-medium text-slate-700 mb-1.5"
//           >
//             Meta Description:
//           </label>
//           <textarea
//             id="meta-desc"
//             rows={5}
//             value={metaDescription}
//             onChange={(e) => setMetaDescription(e.target.value)}
//             className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//           />
//         </div>

//         {/* SERP Preview */}
//         <div>
//           <p className="text-sm font-medium text-slate-700 mb-1.5">Preview</p>

//           <div className="border border-slate-200 rounded-lg p-4 bg-white">
//             <div className="flex items-center gap-2 mb-1">
//               <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
//                 {title.charAt(0).toUpperCase() || "W"}
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-slate-700 leading-none">
//                   {title || "Site Title"}
//                 </p>
//                 <p className="text-[10px] text-slate-400">
//                   https://weightlossmd.com
//                 </p>
//               </div>
//             </div>

//             <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">
//               {title || "Site Title"}
//             </p>

//             <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//               {metaDescription || "Write about your practice here..."}
//             </p>
//           </div>
//         </div>
//       </div>

//       <Divider />

//       <h2 className="text-black">Site Images</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <UploadBox
//           label="Foster White Logo "
//           sublabel="Upload your website logo (recommended: 200x68px)"
//           // dark={true}
//           aspectClass="h-40"
//           previewUrl={
//             whiteLogoFile ? URL.createObjectURL(whiteLogoFile) : whiteLogoUrl
//           }
//           onFileSelected={setWhiteLogoFile}
//         />

//         <UploadBox
//           label="Header Colored Logo"
//           sublabel="Upload your website logo (recommended: 200x68px)"
//           dark={false}
//           aspectClass="h-40"
//           previewUrl={
//             blackLogoFile ? URL.createObjectURL(blackLogoFile) : blackLogoUrl
//           }
//           onFileSelected={setBlackLogoFile}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div>
//           <p className="text-sm font-medium text-slate-700 mb-1">Favicon</p>
//           <p className="text-xs text-slate-400 mb-2">64 × 64 pixels</p>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <p className="text-xs text-slate-500 mb-1.5">Light</p>
//               <UploadBox
//                 label="Favicon Light"
//                 dark={false}
//                 aspectClass="h-28"
//                 previewUrl={
//                   faviconLightFile
//                     ? URL.createObjectURL(faviconLightFile)
//                     : faviconLightUrl
//                 }
//                 onFileSelected={setFaviconLightFile}
//               />
//             </div>

//             <div>
//               <p className="text-xs text-slate-500 mb-1.5">Dark</p>
//               <UploadBox
//                 label="Favicon Dark"
//                 // dark={true}
//                 aspectClass="h-28"
//                 previewUrl={
//                   faviconDarkFile
//                     ? URL.createObjectURL(faviconDarkFile)
//                     : faviconDarkUrl
//                 }
//                 onFileSelected={setFaviconDarkFile}
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <p className="text-sm font-medium text-slate-700 mb-1">
//             Social Preview
//           </p>
//           <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>

//           <UploadBox
//             label="Social Preview"
//             // dark={true}
//             aspectClass="h-28"
//             previewUrl={
//               socialPreviewFile
//                 ? URL.createObjectURL(socialPreviewFile)
//                 : socialPreviewUrl
//             }
//             onFileSelected={setSocialPreviewFile}
//           />
//         </div>
//       </div>

//       {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

//       <button
//         onClick={handleSave}
//         disabled={saving}
//         className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//       >
//         {saving ? "Saving..." : "Save"}
//       </button>
//     </>
//   );
// }

// new code better UI
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
// import { updateSiteSettings } from '@/api/endpoints/websitemanagement.api';
import { uploadAttachment } from "@/api/endpoints/attachments.api";
import { updateSiteSettings } from "@/api/endpoints/websitemanagement.api";
import { toast } from "sonner";

type Props = {
  infoData: any;
};

function Divider() {
  return <hr className="border-slate-200 my-7" />;
}

// ─────────────────────────────────────────────
// LogoUploadBox — big preview box on the left,
// label / sublabel / upload button on the right
// (used for Footer White Logo & Header Colored Logo)
// ─────────────────────────────────────────────
function LogoUploadBox({
  label,
  sublabel,
  dark = false,
  previewUrl,
  onFileSelected,
}: {
  label: string;
  sublabel?: string;
  dark?: boolean;
  previewUrl?: string | null;
  onFileSelected: (file: File) => void;
}) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <p className="text-sm font-bold text-slate-700 mb-2">{label}</p>

      {/* single colored box holding the logo preview + sublabel + upload button */}
      <div
        className={`h-48 rounded-lg flex items-center gap-4 px-6 border p-4 border-slate-200 ${
          dark ? "bg-[#272628]" : "bg-slate-100"
        }`}
      >
        <div className="flex-1 h-full flex items-center justify-center relative overflow-hidden bg-[#E6E6E6]/30 rounded-md">
          {previewUrl && (
            <img
              src={previewUrl}
              alt={label}
              className="max-h-24 max-w-full object-contain"
            />
          )}
        </div>

        <div className="flex-1">
          {sublabel && (
            <p
              className={`text-xs mb-2 ${
                dark ? "text-slate-300" : "text-slate-400"
              }`}
            >
              {sublabel}
            </p>
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
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600  hover:text-black rounded-md shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload size={13} /> Upload
          </label>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SmallUploadBox — preview box on top, label +
// upload button on a row underneath
// (used for Favicon Light/Dark & Social Preview)
// ─────────────────────────────────────────────
function SmallUploadBox({
  label,
  bottomLabel,
  dark = false,
  aspectClass = "h-28",
  previewUrl,
  onFileSelected,
}: {
  label: string;
  bottomLabel?: string;
  dark?: boolean;
  aspectClass?: string;
  previewUrl?: string | null;
  onFileSelected: (file: File) => void;
}) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <div
        className={`${aspectClass} rounded-lg h-48 flex items-center justify-center border border-slate-200 relative overflow-hidden ${
          dark ? "bg-[#1A2340]" : "bg-slate-100"
        }`}
      >
        {previewUrl && (
          <img
            src={previewUrl}
            alt={label}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        {bottomLabel ? (
          <p className="text-xs font-bold text-slate-800">{bottomLabel}</p>
        ) : (
          <span />
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
          className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          <Upload size={16} /> Upload
        </label>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SiteSettingsGeneral({ infoData }: Props) {
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // ── new files picked by user (not yet uploaded) ──
  const [whiteLogoFile, setWhiteLogoFile] = useState<File | null>(null);
  const [blackLogoFile, setBlackLogoFile] = useState<File | null>(null);
  const [faviconLightFile, setFaviconLightFile] = useState<File | null>(null);
  const [faviconDarkFile, setFaviconDarkFile] = useState<File | null>(null);
  const [socialPreviewFile, setSocialPreviewFile] = useState<File | null>(null);

  // ── existing urls from backend (synced on load + after save) ──
  const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(null);
  const [blackLogoUrl, setBlackLogoUrl] = useState<string | null>(null);
  const [faviconLightUrl, setFaviconLightUrl] = useState<string | null>(null);
  const [faviconDarkUrl, setFaviconDarkUrl] = useState<string | null>(null);
  const [socialPreviewUrl, setSocialPreviewUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!infoData) return;
    setTitle(infoData.title || "");
    setMetaDescription(infoData.metaDescription || "");

    setWhiteLogoUrl(infoData.whiteLogo?.fileUrl ?? null);
    setBlackLogoUrl(infoData.blackLogo?.fileUrl ?? null);
    setFaviconLightUrl(infoData.faviconLight?.fileUrl ?? null);
    setFaviconDarkUrl(infoData.faviconDark?.fileUrl ?? null);
    setSocialPreviewUrl(infoData.socialPreview?.fileUrl ?? null);
  }, [infoData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // 1. Upload any newly picked files first — backend wants attachment
      //    ids in the settings payload, not raw files.
      const [
        whiteLogoAttachment,
        blackLogoAttachment,
        faviconLightAttachment,
        faviconDarkAttachment,
        socialPreviewAttachment,
      ] = await Promise.all([
        whiteLogoFile
          ? uploadAttachment(whiteLogoFile, "PRODUCT_IMAGE")
          : Promise.resolve(undefined),
        blackLogoFile
          ? uploadAttachment(blackLogoFile, "PRODUCT_IMAGE")
          : Promise.resolve(undefined),
        faviconLightFile
          ? uploadAttachment(faviconLightFile, "PRODUCT_IMAGE")
          : Promise.resolve(undefined),
        faviconDarkFile
          ? uploadAttachment(faviconDarkFile, "PRODUCT_IMAGE")
          : Promise.resolve(undefined),
        socialPreviewFile
          ? uploadAttachment(socialPreviewFile, "PRODUCT_IMAGE")
          : Promise.resolve(undefined),
      ]);

      // 2. Send plain JSON with ids (not files) to the settings endpoint
      const payload = {
        title,
        metaDescription,
        ...(whiteLogoAttachment && { whiteLogoId: whiteLogoAttachment.id }),
        ...(blackLogoAttachment && { blackLogoId: blackLogoAttachment.id }),
        ...(faviconLightAttachment && {
          faviconLightId: faviconLightAttachment.id,
        }),
        ...(faviconDarkAttachment && {
          faviconDarkId: faviconDarkAttachment.id,
        }),
        ...(socialPreviewAttachment && {
          socialPreviewId: socialPreviewAttachment.id,
        }),
      };

      console.log("🚀 Payload:", payload);

      const updated = await updateSiteSettings(payload);
      console.log(updated);
      // here
      toast.success("Settings updated successfully 🚀");
      // 3. Sync state with server response (new image urls etc.)
      setWhiteLogoUrl(updated.whiteLogo?.fileUrl ?? whiteLogoUrl);
      setBlackLogoUrl(updated.blackLogo?.fileUrl ?? blackLogoUrl);
      setFaviconLightUrl(updated.faviconLight?.fileUrl ?? faviconLightUrl);
      setFaviconDarkUrl(updated.faviconDark?.fileUrl ?? faviconDarkUrl);
      setSocialPreviewUrl(updated.socialPreview?.fileUrl ?? socialPreviewUrl);

      setWhiteLogoFile(null);
      setBlackLogoFile(null);
      setFaviconLightFile(null);
      setFaviconDarkFile(null);
      setSocialPreviewFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="site-title"
          className="block text-sm font-bold text-slate-700 mb-1.5"
        >
          Site Title: 
        </label>
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
          <label
            htmlFor="meta-desc"
            className="block text-sm font-bold text-slate-700 mb-1.5"
          >
            Meta Description:
          </label>
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
          <p className="text-sm font-bold text-slate-700 mb-1.5 ">Preview</p>

          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                {title.charAt(0).toUpperCase() || "W"}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 leading-none">
                  {title || "Site Title"}
                </p>
                <p className="text-[10px] text-slate-400">
                  https://weightlossmd.com
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-blue-700 mt-1 leading-tight">
              {title || "Site Title"}
            </p>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {metaDescription || "Write about your practice here..."}
            </p>
          </div>
        </div>
      </div>

      <Divider />

      <h2 className="text-black font-semibold mb-4">Site Images</h2>

      {/* Footer White Logo / Header Colored Logo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LogoUploadBox
          label="Footer White Logo"
          sublabel="Upload your website logo (recommended: 200x68px)"
          dark={true}
          previewUrl={
            whiteLogoFile ? URL.createObjectURL(whiteLogoFile) : whiteLogoUrl
          }
          onFileSelected={setWhiteLogoFile}
        />

        <LogoUploadBox
          label="Header Colored Logo"
          sublabel="Upload your website logo (recommended: 200x68px)"
          dark={false}
          previewUrl={
            blackLogoFile ? URL.createObjectURL(blackLogoFile) : blackLogoUrl
          }
          onFileSelected={setBlackLogoFile}
        />
      </div>

      {/* Favicon / Social Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-bold text-slate-700 mb-1">Favicon</p>
          <p className="text-xs text-slate-600 mb-2">64 × 64 pixels</p>

          <div className="grid grid-cols-2 gap-3 ">
            <SmallUploadBox
              label="Favicon Light"
              bottomLabel="Light"
              dark={false}
              aspectClass="h-28"
              previewUrl={
                faviconLightFile
                  ? URL.createObjectURL(faviconLightFile)
                  : faviconLightUrl
              }
              onFileSelected={setFaviconLightFile}
            />

            <SmallUploadBox
              label="Favicon Dark"
              bottomLabel="Dark"
              dark={true}
              aspectClass="h-28"
              previewUrl={
                faviconDarkFile
                  ? URL.createObjectURL(faviconDarkFile)
                  : faviconDarkUrl
              }
              onFileSelected={setFaviconDarkFile}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-700 mb-1">
            Social Preview
          </p>
          <p className="text-xs text-slate-400 mb-2">1280 × 630 pixels</p>

          <SmallUploadBox
            label="Social Preview"
            dark={false}
            aspectClass="h-28"
            previewUrl={
              socialPreviewFile
                ? URL.createObjectURL(socialPreviewFile)
                : socialPreviewUrl
            }
            onFileSelected={setSocialPreviewFile}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </>
  );
}