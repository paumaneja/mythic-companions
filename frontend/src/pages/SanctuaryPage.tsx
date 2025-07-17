import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { SanctuaryDto } from '../types';
import StatsPanel from '../components/sanctuary/StatsPanel';
import ProgressionPanel from '../components/sanctuary/ProgressionPanel';
import WeaponPanel from '../components/sanctuary/WeaponPanel';
import CompanionVisualizer from '../components/sanctuary/CompanionVisualizer';
import ActionBar from '../components/sanctuary/ActionBar';


const fetchCompanionDetails = async (id: string, token: string | null): Promise<SanctuaryDto> => {
  if (!token) throw new Error('Not authenticated');
  const { data } = await apiClient.get(`/companions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export default function SanctuaryPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.token);

  const { data: companion, isLoading, isError } = useQuery({
    queryKey: ['companion', id],
    queryFn: () => fetchCompanionDetails(id!, token),
    enabled: !!id && !!token,
  });

  if (isLoading) return <div>Loading Sanctuary...</div>;
  if (isError) return <div>Error loading companion data.</div>;
  if (!companion) return <div>Companion not found.</div>;

  return (
    <div className="p-4" style={{ /* TODO: Add dynamic background here */ }}>
      <h1 className="text-4xl font-bold text-center mb-8">{companion.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <StatsPanel stats={companion.stats} />
          <ProgressionPanel progression={companion.progression} />
          <WeaponPanel weapon={companion.equippedWeapon} companionId={companion.id} />
        </div>

        {/* Right Column (Wider) */}
        <div className="lg:col-span-2">
          <CompanionVisualizer companion={companion} />
          <ActionBar companion={companion} />
        </div>
      </div>
    </div>
  );
}