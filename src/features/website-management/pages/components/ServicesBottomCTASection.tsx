
export interface CtaData {
  id?: string;
  sectionTitle: string;
  ctaButtonText: string;
  url: string;
  openInNewTab: boolean;
}

interface Props {
  data: CtaData;
  onChange: (data: Partial<CtaData>) => void;
}

export default function ServicesBottomCTASection({ data, onChange }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Bottom CTA Section:</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Title:</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => onChange({ sectionTitle: e.target.value })}
          placeholder="Contact Us at Weight Loss MD Today"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text:</label>
          <input
            type="text"
            value={data.ctaButtonText}
            onChange={(e) => onChange({ ctaButtonText: e.target.value })}
            placeholder="Book a consultation"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL:</label>
          <input
            type="text"
            value={data.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://weightlossmd.com/contact"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div className="flex flex-col justify-end pb-3">
          <label className="block text-sm font-medium text-slate-700 mb-2 md:hidden">Button target:</label>
          <span className="hidden md:block text-sm font-medium text-slate-700 mb-2">Button target:</span>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="blank-target-cta"
              checked={data.openInNewTab}
              onChange={(e) => onChange({ openInNewTab: e.target.checked })}
              className="w-4 h-4 text-[#1447E6] rounded border-slate-300 focus:ring-[#1447E6] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="blank-target-cta" className="text-sm text-slate-700 cursor-pointer select-none">Blank (open in new tab)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
