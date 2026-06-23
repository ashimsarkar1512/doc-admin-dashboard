// import { useState } from 'react';

// type Office = {
//   id?: string;
//   name: string;
//   address: string;
//   isActive: boolean;
// };

// interface OfficeAddressProps {
//   infoData: {
//     offices?: Office[];
//   };
// }

// function Toggle({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
//         checked ? 'bg-[#1447E6]' : 'bg-slate-200'
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
//           checked ? 'translate-x-4' : 'translate-x-0'
//         }`}
//       />
//     </button>
//   );
// }

// export default function OfficeAddressSection({
//   infoData,
// }: OfficeAddressProps) {
//   console.log(infoData)
//   const [offices, setOffices] = useState<Office[]>(() => infoData?.offices || []);

//   const updateOffice = (index: number, changes: Partial<Office>) => {
//     setOffices((prev) =>
//       prev.map((office, i) =>
//         i === index ? { ...office, ...changes } : office
//       )
//     );
//   };

//   const handleSave = () => {
//     const payload = {
//       offices,
//     };

//     console.log('🚀 Office Payload:', payload);
//   };

//   return (
//     <>
//       <h2 className="text-lg font-semibold mb-3">Office address</h2>

//       {offices.map((office, i) => (
//         <div key={office.id ?? i} className="grid grid-cols-2 gap-4 mb-3">
//           <div>
//             <div className="flex items-center gap-2 mb-1.5">
//               <span className="text-sm font-medium text-slate-700">
//                 Office {i + 1}
//               </span>

//               <Toggle
//                 checked={office.isActive}
//                 onChange={(v) => updateOffice(i, { isActive: v })}
//               />
//             </div>

//             <input
//               value={office.name}
//               onChange={(e) => updateOffice(i, { name: e.target.value })}
//               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//           </div>

//           <div>
//             <p className="text-sm font-medium text-slate-700 mb-1.5">
//               Address:
//             </p>

//             <input
//               value={office.address}
//               onChange={(e) => updateOffice(i, { address: e.target.value })}
//               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
//             />
//           </div>
//         </div>
//       ))}

//       <button
//         onClick={handleSave}
//         className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
//       >
//         Save
//       </button>
//     </>
//   );
// }


import { useState, useEffect } from 'react';
import { updateOfficeAddresses, type WebsiteSettings, type Office } from '@/api/endpoints/websitemanagement.api'; // adjust path
import { Loader2 } from 'lucide-react';

interface OfficeAddressProps {
  infoData: WebsiteSettings | null;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#1447E6]' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function OfficeAddressSection({
  infoData,
}: OfficeAddressProps) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (infoData?.offices) {
      setOffices(infoData.offices);
    }
  }, [infoData]);

  const updateOffice = (index: number, changes: Partial<Office>) => {
    setOffices((prev) =>
      prev.map((office, i) =>
        i === index ? { ...office, ...changes } : office
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = { offices };

      const updated = await updateOfficeAddresses(payload);

      setOffices(updated.offices || offices);
      setSuccess('Office addresses saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save changes. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Office address</h2>

      {offices.map((office, i) => (
        <div key={office.id ?? i} className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-medium text-slate-700">
                Office {i + 1}
              </span>

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
            <p className="text-sm font-medium text-slate-700 mb-1.5">
              Address:
            </p>

            <input
              value={office.address}
              onChange={(e) => updateOffice(i, { address: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#1447E6] transition"
            />
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && <p className="text-sm text-green-500 mb-3">{success}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
      </button>
    </>
  );
}