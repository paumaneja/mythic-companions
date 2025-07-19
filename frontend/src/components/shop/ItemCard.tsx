import type { DisplayableItem } from '../../types';

interface Props {
  item: DisplayableItem;
  children: React.ReactNode;
}

const rarityColorMap: Record<string, string> = {
  COMMON: 'text-gray-400',
  UNCOMMON: 'text-green-500',
  RARE: 'text-blue-500',
  EPIC: 'text-purple-600',
};

export default function ItemCard({ item, children }: Props) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-lg shadow-lg p-4 flex flex-col text-white text-center h-full">
      <h3 className="text-lg font-bold">{item.name}</h3>
      <p className={`text-xs font-bold mb-2 ${rarityColorMap[item.rarity]}`}>{item.rarity}</p>
      <div className="my-auto flex items-center justify-center h-24">
        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full" />
      </div>
      <p className="text-xs text-gray-300 mt-2 flex-grow min-h-[40px]">{item.description}</p>

      {/* Aquí es renderitzaran els botons que li passem */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}