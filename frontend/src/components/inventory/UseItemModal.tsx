import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CompanionCardDto, InventoryItemDto } from '../../types';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import { useUseItem } from '../../hooks/useUseItem';

interface Props {
  item: InventoryItemDto;
  onClose: () => void;
}

const fetchCompanions = async (token: string | null): Promise<CompanionCardDto[]> => {
  if (!token) return [];
  const { data } = await apiClient.get('/companions', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export default function UseItemModal({ item, onClose }: Props) {
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('');
  const token = useAuthStore((state) => state.token);

  const { data: companions, isLoading } = useQuery({
    queryKey: ['companions'], // React Query might use a cached version here, which is fine
    queryFn: () => fetchCompanions(token),
    enabled: !!token,
  });

  const useItemMutation = useUseItem();

  const handleConfirm = () => {
    if (!selectedCompanionId) {
      alert('Please select a companion.');
      return;
    }
    useItemMutation.mutate({ itemId: item.itemId, companionId: Number(selectedCompanionId) }, {
      onSuccess: () => {
        onClose(); // Tanca el modal en cas d'èxit
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Use {item.name}</h2>
        <p className="mb-4 text-gray-300">Select a companion to use this item on:</p>

        <select
          value={selectedCompanionId}
          onChange={(e) => setSelectedCompanionId(e.target.value)}
          className="w-full p-2 border border-gray-600 bg-gray-700 rounded mb-6"
          disabled={isLoading}
        >
          <option value="" disabled>Select a companion...</option>
          {companions?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
          <button onClick={handleConfirm} disabled={useItemMutation.isPending} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-500">
            {useItemMutation.isPending ? 'Using...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}