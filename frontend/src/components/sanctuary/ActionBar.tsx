import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/apiClient';
import type { SanctuaryDto, UiTheme } from '../../types';
import { useFeedCompanion, usePlayWithCompanion, useCleanCompanion, useSleepCompanion, useTrainCompanion } from '../../hooks/useCompanionActions';

interface Props {
  companion: SanctuaryDto;
  onActionStart: (actionVideoUrl: string) => void;
}

// Funció per obtenir les dades de les icones
const fetchUiThemes = async (): Promise<Record<string, UiTheme>> => {
  const { data } = await apiClient.get('/game-data/ui-themes');
  return data;
};

export default function ActionBar({ companion, onActionStart }: Props) {
  const { data: uiThemes } = useQuery({ queryKey: ['uiThemes'], queryFn: fetchUiThemes });

  const feedMutation = useFeedCompanion();
  const playMutation = usePlayWithCompanion();
  const cleanMutation = useCleanCompanion();
  const sleepMutation = useSleepCompanion();
  const trainMutation = useTrainCompanion();

  const handleActionClick = (action: 'feed' | 'play' | 'clean' | 'sleep' | 'train') => {
    let videoUrl = '';
    const actions = companion.species.assets.actions;

    switch (action) {
      case 'feed':
        videoUrl = actions.feed;
        feedMutation.mutate({ companionId: companion.id });
        break;
      case 'play':
        videoUrl = actions.play;
        playMutation.mutate({ companionId: companion.id });
        break;
      case 'clean':
        videoUrl = actions.clean;
        cleanMutation.mutate({ companionId: companion.id });
        break;
      case 'sleep':
        videoUrl = actions.sleep;
        sleepMutation.mutate({ companionId: companion.id });
        break;
      case 'train':
        videoUrl = actions.train[companion.equippedWeapon?.itemId || ''];
        trainMutation.mutate({ companionId: companion.id });
        break;
    }
    if (videoUrl) onActionStart(videoUrl);
  };

  // Determinem les icones correctes basant-nos en l'univers del companion
  const icons = uiThemes?.[companion.universeId]?.action_icons;

  return (
    <div className="mt-6 rounded-lg bg-white/70 p-4 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-5 gap-4">
            <button onClick={() => handleActionClick('feed')} className="p-2 aspect-square flex items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70">
                {icons && <img src={'/src' + icons.feed} alt="Feed" className="h-10 w-10"/>}
            </button>
            <button onClick={() => handleActionClick('play')} className="p-2 aspect-square flex items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70">
                {icons && <img src={'/src' + icons.play} alt="Play" className="h-10 w-10"/>}
            </button>
            <button onClick={() => handleActionClick('clean')} className="p-2 aspect-square flex items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70">
                {icons && <img src={'/src' + icons.clean} alt="Clean" className="h-10 w-10"/>}
            </button>
            <button onClick={() => handleActionClick('sleep')} className="p-2 aspect-square flex items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70">
                {icons && <img src={'/src' + icons.sleep} alt="Sleep" className="h-10 w-10"/>}
            </button>
            <button onClick={() => handleActionClick('train')} className="p-2 aspect-square flex items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70">
                {icons && <img src={'/src' + icons.train} alt="Train" className="h-10 w-10"/>}
            </button>
        </div>
    </div>
  );
}