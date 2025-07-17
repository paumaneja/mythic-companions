import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { SanctuaryDto, ProgressionDto, EquippedWeaponDto } from '../types';
import StatsPanel from '../components/sanctuary/StatsPanel';


const ProgressionPanel = ({ progression }: { progression: ProgressionDto }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Progression</h2>
        <p>Level: {progression.level}</p>
        <p>XP: {progression.currentXpInLevel} / {progression.xpForNextLevel}</p>
    </div>
);

const WeaponPanel = ({ weapon }: { weapon: EquippedWeaponDto | null }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Weapon</h2>
        <p>{weapon ? weapon.name : 'No weapon equipped'}</p>
    </div>
);

const CompanionVisualizer = ({ companion }: { companion: SanctuaryDto }) => (
    <div className="bg-white p-4 rounded-lg shadow col-span-2 min-h-[400px]">
        Companion Visualizer for {companion.name}
    </div>
);

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
          <WeaponPanel weapon={companion.equippedWeapon} />
        </div>

        {/* Right Column (Wider) */}
        <div className="lg:col-span-2">
          <CompanionVisualizer companion={companion} />
        </div>
      </div>
    </div>
  );
}