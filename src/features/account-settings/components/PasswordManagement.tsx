import {
  Lock,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormInput } from "../../website-management/components/shared/FormInput";
import { useChangePassword } from "../hooks/useAccountSettings";
import type { ChangePasswordPayload } from "@/types/auth.types";

// ─── Password Rule Checklist ────────────────────────────────────────────────

const PASSWORD_RULES = [
  {
    key: "length",
    label: "At least 8 characters long",
    test: (v: string) => v.length >= 8,
  },
  {
    key: "case",
    label: "Include uppercase and lowercase letters",
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  {
    key: "number",
    label: "Include at least one number",
    test: (v: string) => /\d/.test(v),
  },
  {
    key: "special",
    label: "Include at least one special character",
    test: (v: string) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/.test(v),
  },
];

export function PasswordManagement() {
  const changePassword = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordPayload>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";

  const onSubmit = (data: ChangePasswordPayload) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
          <Lock size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">
            Password Management
          </h3>
          <p className="text-[12px] text-slate-400 leading-tight mt-0.5">
            Update passwords for admin and other roles
          </p>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Current Password */}
          <div>
            <div className="relative">
              <Controller
                name="currentPassword"
                control={control}
                rules={{ required: "Current password is required" }}
                render={({ field }) => (
                  <FormInput
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password + Confirm Password — side by side, matches Figma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <div className="relative">
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{
                    required: "New password is required",
                    validate: (value) => {
                      const failed = PASSWORD_RULES.find(
                        (rule) => !rule.test(value),
                      );
                      return failed
                        ? `Password must ${failed.label.toLowerCase()}`
                        : true;
                    },
                  }}
                  render={({ field }) => (
                    <FormInput
                      label="New Password"
                      placeholder="Enter new password"
                      type={showNewPassword ? "text" : "password"}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Please confirm your new password",
                    validate: (value, formValues) =>
                      value === formValues.newPassword ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <FormInput
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {changePassword.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Update Password
            </button>
          </div>

          {/* Password Requirements — live validation checklist */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">
                Password Requirements:
              </span>
            </div>
            <ul className="space-y-1 ml-1">
              {PASSWORD_RULES.map((rule) => {
                const passed =
                  newPasswordValue.length > 0 && rule.test(newPasswordValue);
                return (
                  <li
                    key={rule.key}
                    className={`flex items-center gap-2 text-[13px] transition-colors ${
                      passed ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {passed ? (
                      <Check size={13} className="shrink-0" />
                    ) : (
                      <X size={13} className="shrink-0 opacity-50" />
                    )}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
