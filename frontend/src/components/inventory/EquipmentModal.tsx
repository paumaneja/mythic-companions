import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CompanionCardDto, InventoryItemDto, Species } from '../../types';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import { useEquipWeapon } from '../../hooks/useEquipWeapon';

interface Props {
  item: InventoryItemDto;
  onClose: () => void;
}

const fetchCompanions = async (token: string | null): Promise<CompanionCardDto[]> => {
  if (!token) return [];
  const { data } = await apiClient.get('/companions', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

const fetchAllSpecies = async (): Promise<Species[]> => {
  const { data } = await apiClient.get('/game-data/species');
  return data;
};

export default function EquipmentModal({ item, onClose }: Props) {
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('');
  const token = useAuthStore((state) => state.token);

  const { data: companions } = useQuery({ queryKey: ['companions'], queryFn: () => fetchCompanions(token), enabled: !!token });
  const { data: allSpecies } = useQuery({ queryKey: ['allSpecies'], queryFn: fetchAllSpecies });

  const equipMutation = useEquipWeapon();

  const handleConfirm = () => {
    if (!selectedCompanionId) return;
    equipMutation.mutate({ itemId: item.itemId, companionId: Number(selectedCompanionId) }, {
      onSuccess: onClose
    });
  };

  // LÒGICA DE FILTRAT: Mostrem només companions compatibles
  const compatibleCompanions = companions?.filter(companion => {
    const speciesData = allSpecies?.find(s => s.speciesId === companion.speciesId);
    return speciesData?.allowedWeaponTypes?.includes(item.weaponType || '');
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Equip {item.name}</h2>
        <p className="mb-4 text-gray-300">Select a compatible companion:</p>

        <select
          value={selectedCompanionId}
          onChange={(e) => setSelectedCompanionId(e.target.value)}
          className="w-full p-2 border border-gray-600 bg-gray-700 rounded mb-6"
        >
          <option value="" disabled>Select a companion...</option>
          {compatibleCompanions?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.speciesId})</option>)}
        </select>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
          <button onClick={handleConfirm} disabled={equipMutation.isPending} className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-500">
            {equipMutation.isPending ? 'Equipping...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}