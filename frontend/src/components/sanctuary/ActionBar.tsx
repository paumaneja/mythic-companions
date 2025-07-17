import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/apiClient';
import type { SanctuaryDto, UiTheme } from '../../types';
//import { useAuthStore } from '../../stores/authStore';

interface Props {
  companion: SanctuaryDto;
}

// Funció per obtenir les dades de les icones
const fetchUiThemes = async (): Promise<Record<string, UiTheme>> => {
  const { data } = await apiClient.get('/game-data/ui-themes');
  return data;
};

export default function ActionBar({ companion }: Props) {
  const { data: uiThemes } = useQuery({ queryKey: ['uiThemes'], queryFn: fetchUiThemes });

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action} for companion ${companion.id}`);
    // TODO: Implement useMutation for each action
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