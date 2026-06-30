

import { useState, useEffect } from "react";
import {
  updateContactInfo,
  type WebsiteSettings,
} from "@/api/endpoints/websitemanagement.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactInfoProps {
  infoData: WebsiteSettings | null;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
      />
    </div>
  );
}

export default function SiteSettingContactInfo({ infoData }: ContactInfoProps) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [closedDays, setClosedDays] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    console.log("SiteSettingContactInfo infoData:", infoData);
    if (infoData?.contactInfo) {
      setPhone(infoData.contactInfo.phone || "");
      setEmail(infoData.contactInfo.email || "");
      setOpenHours(infoData.contactInfo.openHours || "");
      setClosedDays(infoData.contactInfo.closedDays || "");
    }
  }, [infoData]);

  const handleSave = async () => {
    const payload = {
      phone,
      email,
      openHours,
      closedDays,
    };

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updateContactInfo(payload);
          toast.success("Contact info  saved successfully!");
      setSuccess("Contact info  saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save contact info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Field
          id="phone"
          label="Phone number:"
          value={phone}
          onChange={setPhone}
          placeholder="(720) 279-1164"
        />
        <Field
          id="email"
          label="Email:"
          value={email}
          onChange={setEmail}
          placeholder="info@wlmd.net"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field
          id="opening"
          label="Opening:"
          value={openHours}
          onChange={setOpenHours}
        />
        <Field
          id="offday"
          label="Off day:"
          value={closedDays}
          onChange={setClosedDays}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {/* {success && <p className="text-sm text-green-500">{success}</p>} */}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : "Save"}
      </button>
    </>
  );
}
