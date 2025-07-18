import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { SanctuaryDto } from '../types';
import StatsPanel from '../components/sanctuary/StatsPanel';
import ProgressionPanel from '../components/sanctuary/ProgressionPanel';
import WeaponPanel from '../components/sanctuary/WeaponPanel';
import CompanionVisualizer from '../components/sanctuary/CompanionVisualizer';


const fetchCompanionDetails = async (id: string, token: string | null): Promise<SanctuaryDto> => {
  if (!token) throw new Error('Not authenticated');
  const { data } = await apiClient.get(`/companions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export default function SanctuaryPage() {
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.token);

  const { data: companion, isLoading, isError } = useQuery({
    queryKey: ['companion', id],
    queryFn: () => fetchCompanionDetails(id!, token),
    enabled: !!id && !!token,
  });

  const handleActionStart = (actionName: string) => {
    if (!companion) return;

    let videoUrl: string | undefined = undefined;
    const actions = companion.species.assets.actions;

    if (actionName === 'train') {
      const weaponId = companion.equippedWeapon?.itemId;
      if (weaponId && actions.train) {
        videoUrl = actions.train[weaponId];
      }
    } else {
      // Access other actions safely
      videoUrl = actions[actionName as keyof Omit<typeof actions, 'train'>];
    }
  
    if (videoUrl) {
      setPlayingVideoUrl(videoUrl);
    } else {
        console.warn(`No video URL found for action '${actionName}'`);
    }
  };

  if (isLoading) return <div>Loading Sanctuary...</div>;
  if (isError) return <div>Error loading companion data.</div>;
  if (!companion) return <div>Companion not found.</div>;

  const backgroundUrl = `/src/assets/images/universes/${companion.universeId}.jpg`;

  return (
    <div
      className="p-6 min-h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >  
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
          <CompanionVisualizer 
            companion={companion} 
            playingVideoUrl={playingVideoUrl}
            onVideoEnd={() => setPlayingVideoUrl(null)}
            onActionStart={handleActionStart}
          />
        </div>
      </div>
    </div>
  );
}