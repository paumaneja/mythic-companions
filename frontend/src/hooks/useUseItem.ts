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

    onSuccess: (data, variables) => {
      console.log("Item used successfully");
      // Refresca totes les dades que podrien haver canviat
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['companion', String(variables.companionId)] });
    },
  });
};