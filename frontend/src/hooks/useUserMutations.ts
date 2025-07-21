import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { UserDto } from '../types';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

type UpdatePasswordPayload = { oldPassword: string; newPassword: string };

export const useUpdateAvatar = () => {
  const { token, setToken } = useAuthStore();
  return useMutation<UserDto, Error, FormData>({
    mutationFn: (formData) => 
      apiClient.post('/users/me/avatar', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        },
      }).then(res => res.data),
    onSuccess: (updatedUser) => {
      if (token) setToken(token, updatedUser);
    },
  });
};

export const useUpdatePassword = () => {
  const token = useAuthStore((state) => state.token);
  return useMutation<void, AxiosError<ApiError>, UpdatePasswordPayload>({
    mutationFn: (data) =>
      apiClient.put('/users/me/password', data, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),
  });
};