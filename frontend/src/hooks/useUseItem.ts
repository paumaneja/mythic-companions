import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';

interface UseItemPayload {
  itemId: string;
  companionId: number;
}

export const useUseItem = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: ({ itemId, companionId }: UseItemPayload) => 
      apiClient.post(`/inventory/use/${itemId}`, { companionId }, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['companion', String(variables.companionId)] });
    },
  });
};