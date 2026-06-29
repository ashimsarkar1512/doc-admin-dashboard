


import  { useState, useEffect } from 'react';
import { updateSocialLinks,  type WebsiteSettings } from '@/api/endpoints/websitemanagement.api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type SocialKey = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

interface SocialLinksProps {
  infoData: WebsiteSettings | null;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder = '',
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

export default function SiteSettingSocialLinks({
  infoData,
}: SocialLinksProps) {
  const [socialLinks, setSocialLinks] = useState<Record<SocialKey, string>>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (infoData?.socialLinks) {
      const links = infoData.socialLinks.reduce((acc, link) => {
        if (link.name in socialLinks) {
          acc[link.name as SocialKey] = link.url;
        }
        return acc;
      }, {} as Record<SocialKey, string>);
      setSocialLinks(links);
    }
  }, [infoData]);

  const updateSocialLink = (key: SocialKey, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const payload = {
      socialLinks: Object.entries(socialLinks)
        .map(([name, url]) => ({ name, url }))
        .filter(link => link.url),
    };

    try {
        setSaving(true);
        setError(null);
        await updateSocialLinks(payload);
           toast.success("Social Links updated successfully ");
    } catch (err: any) {
        setError(err.message || 'Failed to save social links');
    } finally {
        setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Field
          id="facebook"
          label="Facebook:"
          placeholder="https://"
          value={socialLinks.facebook}
          onChange={(v) => updateSocialLink('facebook', v)}
        />
        <Field
          id="instagram"
          label="Instagram:"
          placeholder="https://"
          value={socialLinks.instagram}
          onChange={(v) => updateSocialLink('instagram', v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field
          id="twitter"
          label="Twitter:"
          placeholder="https://"
          value={socialLinks.twitter}
          onChange={(v) => updateSocialLink('twitter', v)}
        />
        <Field
          id="linkedin"
          label="LinkedIn:"
          placeholder="https://"
          value={socialLinks.linkedin}
          onChange={(v) => updateSocialLink('linkedin', v)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
      </button>
    </>
  );
}