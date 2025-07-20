import type { MemoryCard as MemoryCardType } from '../../lib/gameUtils';

interface Props {
  card: MemoryCardType;
  onCardClick: (card: MemoryCardType) => void;
  isDisabled: boolean;
}

export default function MemoryCard({ card, onCardClick, isDisabled }: Props) {
  const handleClick = () => {
    if (!isDisabled && !card.isFlipped) {
      onCardClick(card);
    }
  };

  return (
    <div className="aspect-square perspective" onClick={handleClick}>
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Cara Posterior */}
        <div className="absolute w-full h-full backface-hidden bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-4xl">?</span>
        </div>
        {/* Cara Frontal */}
        <div className="absolute w-full h-full backface-hidden bg-gray-700 rounded-lg rotate-y-180 p-2">
          <img src={card.imageUrl} alt="card" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}