import { useState } from "react";

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({
  defaultChecked = true,
  checked: controlledChecked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const currentChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !currentChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newState);
    }
    if (onChange) onChange(newState);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${currentChecked ? "bg-[#1447E6]" : "bg-slate-300"}`}
    >
      <div
        className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${currentChecked ? "translate-x-4" : "translate-x-0"}`}
      ></div>
    </div>
  );
}
