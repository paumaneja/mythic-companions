import type { SanctuaryDto } from '../../types';
import ActionBar from './ActionBar';

interface Props {
  companion: SanctuaryDto;
  playingVideoUrl: string | null;
  onVideoEnd: () => void;
  onActionStart: (action: string) => void;
}

export default function CompanionVisualizer({ companion, playingVideoUrl, onVideoEnd, onActionStart }: Props) {
  const imageUrl = companion.equippedWeapon
    ? companion.species.assets.static_equipped[companion.equippedWeapon.itemId]
    : companion.species.assets.static_unequipped;

  return (
    <div className="relative flex h-full min-h-[400px] items-center justify-center rounded-lg bg-white/70 p-4 shadow-lg backdrop-blur-md">
      {playingVideoUrl ? (
        <video
          key={playingVideoUrl}
          src={playingVideoUrl}
          autoPlay
          onEnded={onVideoEnd}
          className="max-w-full max-h-96"
        />
      ) : (
      <img 
        src={imageUrl} 
        alt={companion.name} 
        className="max-h-96 max-w-full"
      />
      )}

      {/* Icones d'estat sobreimpreses */}
      {companion.status === 'SICK' && (
        <div className="absolute top-4 right-4 text-4xl animate-pulse" title="Sick">⚠️</div>
      )}
      {companion.status === 'HOSPITALIZED' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
          <span className="text-3xl font-bold text-white">HOSPITALIZED</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0">
        <ActionBar companion={companion} onActionStart={onActionStart} />
      </div>
    </div>
  );
}