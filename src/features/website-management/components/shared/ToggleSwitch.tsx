import React, { useState } from 'react';

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function ToggleSwitch({ defaultChecked = true, onChange }: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !checked;
    setChecked(newState);
    if (onChange) onChange(newState);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${checked ? 'bg-[#1447E6]' : 'bg-slate-300'}`}
    >
      <div className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
  );
}
