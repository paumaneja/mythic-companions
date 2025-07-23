import type { EquippedWeaponDto } from '../../types';
import { Link } from 'react-router-dom';
import { useUnequipWeapon } from '../../hooks/useUnequipWeapon';

interface WeaponPanelProps {
  weapon: EquippedWeaponDto | null;
  companionId: number;
}

export default function WeaponPanel({ weapon, companionId }: WeaponPanelProps) {
  const unequipMutation = useUnequipWeapon();

  const handleUnequip = () => {
    unequipMutation.mutate(companionId);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-center text-2xl font-tomorrow font-bold mb-4 border-b border-white/20 pb-2">Weapon</h2>
      {weapon ? (
        <div>
          <div className='flex items-center space-x-4'>
            <img src={weapon.imageUrl} alt={weapon.name} className="w-16 h-16 bg-gray-200 rounded-md p-1" />
            <div>
              <p className="text-lg font-tomorrow font-semibold">{weapon.name}</p>
              <p className="text-sm font-tomorrow text-white">{weapon.itemId}</p>
            </div>
          </div>
          <button
            onClick={handleUnequip}
            disabled={unequipMutation.isPending}
            className="w-full mt-4 font-tomorrow bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {unequipMutation.isPending ? 'Unequipping...' : 'Unequip'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-tomorrow text-gray-300 mb-4">No weapon equipped.</p>
          <Link to="/inventory" className="font-tomorrow text-blue-600 hover:underline">
            Go to Inventory
          </Link>
        </div>
      )}
    </div>
  );
}