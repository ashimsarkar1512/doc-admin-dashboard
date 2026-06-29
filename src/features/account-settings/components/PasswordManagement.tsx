
import { Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormInput } from '../../website-management/components/shared/FormInput';
import { useChangePassword } from '../hooks/useAccountSettings';
import type { ChangePasswordPayload } from '@/types/auth.types';

export function PasswordManagement() {
  const changePassword = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordPayload>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordPayload) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          <Lock size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">Change Password</h3>
          <p className="text-[12px] text-slate-400 leading-tight mt-0.5">Update your account password</p>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: 'Current password is required' }}
              render={({ field }) => (
                <FormInput
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
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
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div className="relative">
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              }}
              render={({ field }) => (
                <FormInput
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
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
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your new password',
                validate: (value, formValues) =>
                  value === formValues.newPassword || 'Passwords do not match',
              }}
              render={({ field }) => (
                <FormInput
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...field}
                />
              )}
            />
            <button
              type="button"
              className="absolute bottom-2 right-2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {changePassword.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
