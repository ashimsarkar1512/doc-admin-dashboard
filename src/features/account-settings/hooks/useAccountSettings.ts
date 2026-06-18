
import {
  getSessions,
  getUserPreferences,
  getUserProfile,
  toggleMfa,
  updateUserPreferences,
  updateUserProfile,
  uploadAvatar,
} from '@/api/endpoints/auth.api';
import type {
  Session,
  UpdateUserPreferencesPayload,
  UpdateUserProfilePayload,
  UserPreferences,
  UserProfile,
} from '@/types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await getUserProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UpdateProfileContext {
  previousProfile?: UserProfile;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, unknown, UpdateUserProfilePayload, UpdateProfileContext>({
    mutationFn: async (payload) => {
      const res = await updateUserProfile(payload);
      return res.data;
    },
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], {
          ...previousProfile,
          ...newProfile,
        });
      }
      return { previousProfile };
    },
    onError: (_err, _newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
      toast.error('Failed to update profile');
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation<{ avatarId: string }, unknown, File>({
    mutationFn: async (file) => {
      const res = await uploadAvatar(file);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Avatar uploaded successfully');
      const currentProfile = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (currentProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], {
          ...currentProfile,
          avatarId: data.avatarId,
        });
      }
    },
    onError: () => {
      toast.error('Failed to upload avatar');
    },
  });
};

interface ToggleMfaContext {
  previousProfile?: UserProfile;
}

export const useToggleMfa = () => {
  const queryClient = useQueryClient();
  return useMutation<{ mfaEnabled: boolean }, unknown, void, ToggleMfaContext>({
    mutationFn: async () => {
      const res = await toggleMfa();
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], {
          ...previousProfile,
          mfaEnabled: !previousProfile.mfaEnabled,
        });
      }
      return { previousProfile };
    },
    onError: (_err, _, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
      toast.error('Failed to toggle 2FA');
    },
    onSuccess: () => {
      toast.success('2FA status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUserPreferences = () => {
  return useQuery<UserPreferences>({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const res = await getUserPreferences();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UpdatePreferencesContext {
  previousPrefs?: UserPreferences;
}

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation<UserPreferences, unknown, UpdateUserPreferencesPayload, UpdatePreferencesContext>({
    mutationFn: async (payload) => {
      const res = await updateUserPreferences(payload);
      return res.data;
    },
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: ['userPreferences'] });
      const previousPrefs = queryClient.getQueryData<UserPreferences>(['userPreferences']);
      if (previousPrefs) {
        queryClient.setQueryData<UserPreferences>(['userPreferences'], {
          ...previousPrefs,
          ...newPrefs,
        });
      }
      return { previousPrefs };
    },
    onError: (_err, _, context) => {
      if (context?.previousPrefs) {
        queryClient.setQueryData(['userPreferences'], context.previousPrefs);
      }
      toast.error('Failed to update preferences');
    },
    onSuccess: () => {
      toast.success('Preferences updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });
};

export const useSessions = () => {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await getSessions();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
