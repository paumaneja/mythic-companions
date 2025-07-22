import { useCooldown } from '../../hooks/useCooldown';

interface Props {
  label: string;
  iconUrl?: string;
  cooldownTimestamp: string | null;
  onClick: () => void;
  isMutating: boolean;
  isActionEnabled: boolean;
}

export default function ActionButton({ label, iconUrl, cooldownTimestamp, onClick, isMutating, isActionEnabled }: Props) {
  const { isOnCooldown, timeLeftFormatted } = useCooldown(cooldownTimestamp);
  const isDisabled = !isActionEnabled || isOnCooldown || isMutating;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="aspect-square flex flex-col items-center justify-center rounded-md bg-gray-600/50 hover:bg-gray-700/70 transition-colors disabled:bg-gray-500/50 disabled:cursor-not-allowed"
      title={label}
    >
      {isOnCooldown ? (
        <span className="text-white font-mono text-sm">{timeLeftFormatted}</span>
      ) : (
        iconUrl && <img src={iconUrl} alt={label} className="w-full h-full rounded-md object-contain" />
      )}
    </button>
  );
}