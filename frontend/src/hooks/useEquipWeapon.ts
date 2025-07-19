import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';

interface EquipWeaponPayload {
  itemId: string;
  companionId: number;
}

export const useEquipWeapon = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: ({ itemId, companionId }: EquipWeaponPayload) => 
      apiClient.post(`/equipment/equip/${itemId}`, { companionId }, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['companion', String(variables.companionId)] });
      queryClient.invalidateQueries({ queryKey: ['companions'] });
    },
  });
};