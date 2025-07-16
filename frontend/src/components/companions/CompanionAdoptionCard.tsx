import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import apiClient from '../../lib/apiClient';
import type { AdoptionUniverseDto } from '../../types';

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
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Adopt New Companion</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <input {...register('name', { required: true })} placeholder="Companion Name" className="p-2 border rounded" />

        <select value={selectedUniverseId} onChange={(e) => setSelectedUniverseId(e.target.value)} className="p-2 border rounded">
          <option value="" disabled>1. Select a Universe</option>
          {isLoading ? <option>Loading...</option> : adoptionOptions?.map(u => <option key={u.universeId} value={u.universeId}>{u.name}</option>)}
        </select>

        <select {...register('speciesId', { required: true })} disabled={!selectedUniverseId} className="p-2 border rounded disabled:bg-gray-200">
          <option value="" disabled>2. Select a Species</option>
          {availableSpecies?.map(s => <option key={s.speciesId} value={s.speciesId}>{s.name}</option>)}
        </select>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" disabled={adoptMutation.isPending}>
          {adoptMutation.isPending ? 'Adopting...' : 'Adopt'}
        </button>
      </form>
    </div>
  );
}