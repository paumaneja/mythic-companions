import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import apiClient from '../../lib/apiClient';
import type { AdoptionUniverseDto } from '../../types';

import AddIcon from '../../assets/icons/adoption-icon.svg?react';

interface Props {
  existingSpeciesIds: string[];
}

type FormData = { name: string; speciesId: string; };

const fetchAdoptionOptions = async (): Promise<AdoptionUniverseDto[]> => {
  const { data } = await apiClient.get('/game-data/adoption-options');
  return data;
};

export default function CompanionAdoptionCard({ existingSpeciesIds }: Props) {
  const [selectedUniverseId, setSelectedUniverseId] = useState<string>('');
  const { register, handleSubmit, reset } = useForm<FormData>({ defaultValues: { speciesId: '' }});
  const queryClient = useQueryClient();

  const { data: adoptionOptions, isLoading } = useQuery({
    queryKey: ['adoptionOptions'],
    queryFn: fetchAdoptionOptions,
  });

  const adoptMutation = useMutation({
    mutationFn: (data: FormData) => apiClient.post('/companions', data, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      reset({ name: '', speciesId: ''});
      setSelectedUniverseId('');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (window.confirm(`Are you sure you want to adopt a companion named "${data.name}"? This cannot be changed.`)) {
        adoptMutation.mutate(data);
    }
  };

  const selectedUniverse = adoptionOptions?.find(u => u.universeId === selectedUniverseId);
  const availableSpecies = selectedUniverse?.species.filter(s => !existingSpeciesIds.includes(s.speciesId));

  return (
    <div className="block p-4 border-2 border-dashed border-gray-300 bg-gray-800/80 rounded-lg shadow-lg">
      <div className="flex flex-col">
        <div className="w-full aspect-video bg-gray-900/50 mb-4 rounded-md flex flex-col p-4">
          <h3 className="font-tomorrow text-xl font-bold text-white mb-2 text-center">Adopt New Companion</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 flex flex-col justify-between">
            <div className="py-2 space-y-6">
              <select value={selectedUniverseId} onChange={(e) => setSelectedUniverseId(e.target.value)} className="w-full p-2 border rounded bg-white font-tomorrow text-black text-sm">
                <option value="" disabled>Select Universe</option>
                {isLoading ? <option>Loading...</option> : adoptionOptions?.map(u => <option key={u.universeId} value={u.universeId}>{u.name}</option>)}
              </select>
              <select {...register('speciesId', { required: true })} disabled={!selectedUniverseId || availableSpecies?.length === 0} className="w-full p-2 border rounded disabled:bg-gray-200 bg-white font-tomorrow text-black text-sm">
                <option value="" disabled>Select Species</option>
                {availableSpecies?.map(s => <option key={s.speciesId} value={s.speciesId}>{s.name}</option>)}
              </select>
              <input {...register('name', { required: true })} placeholder="Companion Name" className="w-full p-2 border rounded font-tomorrow text-sm" />
            </div>
          </form>
        </div>
      </div>
      <div className="p-2">
         <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 justify-center">
            <button type="submit" className="p-2 bg-black hover:bg-gray-700 rounded" disabled={adoptMutation.isPending}>
                <AddIcon className="w-6 h-6 text-white"/>
            </button>
         </form>
      </div>
    </div>
  );
}