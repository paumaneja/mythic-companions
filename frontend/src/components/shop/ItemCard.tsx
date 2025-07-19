import type { Item } from '../../types';

interface Props {
  item: Item;
  onBuy: () => void;
  isBuying: boolean;
}

const rarityColorMap: Record<string, string> = {
  COMMON: 'text-gray-400',
  UNCOMMON: 'text-green-500',
  RARE: 'text-blue-500',
  EPIC: 'text-purple-600',
};

export default function ItemCard({ item, onBuy, isBuying }: Props) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-4 flex flex-col text-white text-center">
      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      <p className={`text-sm font-bold mb-2 ${rarityColorMap[item.rarity]}`}>{item.rarity}</p>
      <div className="my-auto flex items-center justify-center h-32">
        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full rounded-lg" />
      </div>
      <p className="text-xs text-gray-300 mt-2 flex-grow">{item.description}</p>
      <div className="mt-4">
        <p className="text-lg font-bold text-yellow-400 mb-2">{item.price} Coins</p>
        <button
          onClick={onBuy}
          disabled={isBuying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500"
        >
          {isBuying ? 'Buying...' : 'Buy'}
        </button>
      </div>
    </div>
  );
}