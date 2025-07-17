import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { SanctuaryDto } from '../types';

const useCompanionAction = (action: string) => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation<SanctuaryDto, Error, { companionId: number }>({
    mutationFn: ({ companionId }) => 
      apiClient.post(`/companions/${companionId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),

    onSuccess: (updatedCompanion) => {
      queryClient.setQueryData(['companion', String(updatedCompanion.id)], updatedCompanion);
    },
  });
};

export const useFeedCompanion = () => useCompanionAction('feed');
export const usePlayWithCompanion = () => useCompanionAction('play');
export const useCleanCompanion = () => useCompanionAction('clean');
export const useSleepCompanion = () => useCompanionAction('sleep');
export const useTrainCompanion = () => useCompanionAction('train');