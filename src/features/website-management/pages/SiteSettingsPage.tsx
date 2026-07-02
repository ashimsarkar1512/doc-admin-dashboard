
import React, { useEffect, useState } from "react";
import {  Loader2 } from "lucide-react";
import {
  getWebsiteSettings,
  // updateWebsiteSettings,
  type WebsiteSettings,

} from "@/api/endpoints/websitemanagement.api";

import SiteSettingSocialLinks from "@/features/dashboard/components/SiteSettingPageComponent/SiteSettingSocialLinks";
import SiteSettingContactInfo from "@/features/dashboard/components/SiteSettingPageComponent/SiteSettingContactInfo";
import MeasurementIdField from "@/features/dashboard/components/SiteSettingPageComponent/MeasurementIdField";
import OfficeAddressSection from "@/features/dashboard/components/SiteSettingPageComponent/OfficeAddressSection";
import SiteSettingsGeneral from "@/features/dashboard/components/SiteSettingPageComponent/SiteSettingsGeneral";


function Divider() {
  return <hr className="border-slate-200 my-7" />;
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold text-slate-800 mb-4">{children}</h3>
  );
}

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, ] = useState<string | null>(null);

  // Core fields
  const [data, setData] = useState<WebsiteSettings | null>(null);
// console.log(data)
   useEffect(() => {
   const loadData = async () => {
     try {
       const res = await getWebsiteSettings();
       setData(res);
     } catch (err) {
       console.error(err);
     }  finally {
        setLoading(false);
     }
   };


   loadData();
 }, []);



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

        {/* ── Site Settings ───────────────────────────────────────────── */}
        <SectionHeading>Site Settings </SectionHeading>

        
        {/* testing start  */}
        <SiteSettingsGeneral infoData={data}/>
         <Divider />

        <OfficeAddressSection infoData={data} />
        <Divider />

        {/* ── Contact info ────────────────────────────────────────────── */}
        <SectionHeading>Contact info</SectionHeading>

        <SiteSettingContactInfo infoData={data} />
        <Divider />

        {/* ── Social Links ─────────────────────────────────────────────── */}
        <SectionHeading>Social Links</SectionHeading>

        <Divider />
        <SiteSettingSocialLinks infoData={data} />

        <Divider />
        {/* ── Google Analytics ─────────────────────────────────────────── */}
        <SectionHeading>Google Analytics</SectionHeading>

        <MeasurementIdField infoData={data} />


   
      </div>
    </div>
  );
}
