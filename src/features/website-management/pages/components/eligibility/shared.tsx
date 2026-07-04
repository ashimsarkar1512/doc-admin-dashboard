import type { ReactNode } from "react";

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#D1D5DC] bg-white rounded-[10px] p-4 md:p-5 flex flex-col gap-y-4 lg:gap-y-5">
      <div className="font-['Quicksand'] text-[18px] leading-[20px] font-semibold tracking-[0px] text-[#272628]">
        {title}
      </div>

      <div className="mt-2 font-['Quicksand'] text-[14px] leading-none font-normal tracking-[0px] text-[#272628]">
        {children}
      </div>
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block font-['Quicksand'] text-[14px] leading-[20px] font-semibold tracking-[0px] text-[#272628]">
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

export function TextAreaInput({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}
