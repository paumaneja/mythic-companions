import type { SanctuaryDto, UiTheme } from '../../types';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/apiClient';
import { useFeedCompanion, usePlayWithCompanion, useCleanCompanion, useSleepCompanion, useTrainCompanion } from '../../hooks/useCompanionActions';
import ActionButton from './ActionButton'; // Import the new component

interface Props {
  companion: SanctuaryDto;
  onActionStart: (actionVideoUrl: string) => void;
}

const fetchUiThemes = async (): Promise<Record<string, UiTheme>> => {
  const { data } = await apiClient.get('/game-data/ui-themes');
  return data;
};

export default function ActionBar({ companion, onActionStart }: Props) {
  const { data: uiThemes } = useQuery({ queryKey: ['uiThemes'], queryFn: fetchUiThemes });
  const icons = uiThemes?.[companion.universeId]?.action_icons;

  const feedMutation = useFeedCompanion();
  const playMutation = usePlayWithCompanion();
  const cleanMutation = useCleanCompanion();
  const sleepMutation = useSleepCompanion();
  const trainMutation = useTrainCompanion();

  const handleActionClick = (action: 'feed' | 'play' | 'clean' | 'sleep' | 'train') => {
    const actions = companion.species.assets.actions;
    let videoUrl = '';
    let mutation;

    switch (action) {
      case 'feed': videoUrl = actions.feed; mutation = feedMutation; break;
      case 'play': videoUrl = actions.play; mutation = playMutation; break;
      case 'clean': videoUrl = actions.clean; mutation = cleanMutation; break;
      case 'sleep': videoUrl = actions.sleep; mutation = sleepMutation; break;
      case 'train': videoUrl = actions.train[companion.equippedWeapon?.itemId || '']; mutation = trainMutation; break;
    }

    if (!videoUrl || mutation.isPending) return;

    mutation.mutate({ companionId: companion.id }, {
      onSuccess: () => onActionStart(action)
    });
  };

  return (
    <div className="mt-6 rounded-lg bg-white/70 p-4 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-5 gap-4">
            <ActionButton label="Feed" iconUrl={icons?.feed} cooldownTimestamp={companion.cooldowns.feed} onClick={() => handleActionClick('feed')} isMutating={feedMutation.isPending} />
            <ActionButton label="Play" iconUrl={icons?.play} cooldownTimestamp={companion.cooldowns.play} onClick={() => handleActionClick('play')} isMutating={playMutation.isPending} />
            <ActionButton label="Clean" iconUrl={icons?.clean} cooldownTimestamp={companion.cooldowns.clean} onClick={() => handleActionClick('clean')} isMutating={cleanMutation.isPending} />
            <ActionButton label="Sleep" iconUrl={icons?.sleep} cooldownTimestamp={companion.cooldowns.sleep} onClick={() => handleActionClick('sleep')} isMutating={sleepMutation.isPending} />
            <ActionButton label="Train" iconUrl={icons?.train} cooldownTimestamp={companion.cooldowns.train} onClick={() => handleActionClick('train')} isMutating={trainMutation.isPending} />
        </div>
    </div>
  );
}