
import { Camera, Save, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormInput } from '../../website-management/components/shared/FormInput';
import { FormTextarea } from '../../website-management/components/shared/FormTextarea';
import { 
  useUserProfile, 
  useUpdateUserProfile, 
  useUploadAvatar 
} from '../hooks/useAccountSettings';
import type { UpdateUserProfilePayload } from '@/types/auth.types';

export function AccountInformation() {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<UpdateUserProfilePayload>({
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      specialty: '',
      officeLocation: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile?.profile) {
      reset({
        name: profile.profile.name,
        title: profile.profile.title,
        bio: profile.profile.bio,
        specialty: profile.profile.specialty,
        officeLocation: profile.profile.officeLocation,
        address: profile.profile.address,
        city: profile.profile.city,
        state: profile.profile.state,
        zipCode: profile.profile.zipCode,
      });
      if (profile.profile.avatar) {
        setAvatarPreview(profile.profile.avatar);
      }
    }
  }, [profile?.profile, reset]);

  const onSubmit = (data: UpdateUserProfilePayload) => {
    updateProfile.mutate(data);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadAvatar.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Account Information</h3>
        </div>
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">Account Information</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Avatar Upload */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img 
            src={avatarPreview || '/images/Login.png'} className="w-full h-full object-cover" alt="Profile avatar" />
          <div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Camera size={16} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#1447E6] rounded-full flex items-center justify-center border-2 border-white">
            <Camera size={10} className="text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <FormInput label="Full Name" {...field} />}
          />
          <Controller
            name="title"
            control={control}
            render={({ field }) => <FormInput label="Role/Title" {...field} />}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Email" value={profile?.email || ''} disabled />
            <FormInput label="Contact Number" value={profile?.phone || ''} disabled />
          </div>
          
          <Controller
            name="officeLocation"
            control={control}
            render={({ field }) => <FormInput label="Office" {...field} />}
          />
          
          <Controller
            name="address"
            control={control}
            render={({ field }) => <FormInput label="Address" {...field} />}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="city"
              control={control}
              render={({ field }) => <FormInput label="City" {...field} />}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="state"
                control={control}
                render={({ field }) => <FormInput label="State" {...field} />}
              />
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => <FormInput label="Zip" {...field} />}
              />
            </div>
          </div>
          
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <FormTextarea 
                label="About" 
                className="h-24"
                {...field} 
              />
            )}
          />

          {/* Save Button */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {updateProfile.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
