
import { useState, useEffect } from 'react';
import { updateGoogleAnalytics, type WebsiteSettings } from '@/api/endpoints/websitemanagement.api';
import { Loader2 } from 'lucide-react';

interface MeasurementIdProps {
  infoData: WebsiteSettings | null;
}

export default function MeasurementIdField({
  infoData,
}: MeasurementIdProps) {
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (infoData?.googleAnalytics) {
      setGaMeasurementId(infoData.googleAnalytics.gaMeasurementId || '');
    }
  }, [infoData]);

  const handleSave = async () => {
    const payload = {
      gaMeasurementId,
    };

    try {
        setSaving(true);
        setError(null);
        await updateGoogleAnalytics(payload);
    } catch (err: any) {
        setError(err.message || 'Failed to save Measurement ID');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        Directly integrate Google Analytics into your site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR.
      </p>
      <label
        htmlFor="ga-id"
        className="block text-sm font-medium text-slate-700 mb-1.5"
      >
        Measurement ID:
      </label>

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

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
      </button>
    </div>
  );
}