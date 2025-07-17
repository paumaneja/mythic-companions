import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';

export const useUnequipWeapon = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (companionId: number) => {
      return apiClient.post(`/equipment/unequip/${companionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (_data, companionId) => {
      // Invalidate the query for this specific companion to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['companion', String(companionId)] });
    },
  });
};