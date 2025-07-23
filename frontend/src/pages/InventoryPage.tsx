import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { InventoryItemDto } from '../types';
import { useAuthStore } from '../stores/authStore';
import ItemCard from '../components/shop/ItemCard';
import UseItemModal from '../components/inventory/UseItemModal';
import EquipmentModal from '../components/inventory/EquipmentModal';
import InventoryBackgroundImage from '../assets/images/inventory-background.png';

const fetchInventory = async (token: string | null): Promise<InventoryItemDto[]> => {
  if (!token) return [];
  const { data } = await apiClient.get('/inventory', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export default function InventoryPage() {
  const [itemToUse, setItemToUse] = useState<InventoryItemDto | null>(null);
  const [itemToEquip, setItemToEquip] = useState<InventoryItemDto | null>(null);
  const token = useAuthStore((state) => state.token);
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => fetchInventory(token),
    enabled: !!token,
  });

  if (isLoading) return <div className="text-center p-10 text-white">Loading inventory...</div>;

  return (
    <div className="relative h-full w-full flex flex-col">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${InventoryBackgroundImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative h-full flex flex-col font-tomorrow">
        <header className="p-6">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">Your Inventory</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
        {inventory && inventory.length > 0 ? (
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {inventory.map((item) => (
                <ItemCard key={item.itemId} item={item}>
                  <div className='flex justify-between items-center w-full'>
                    <span className='font-bold text-lg'>x{item.quantity}</span>
                    <div className="flex space-x-2">
                      {item.type === 'CONSUMABLE' && <button onClick={() => setItemToUse(item)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Use</button>}
                      {item.type === 'WEAPON' && <button onClick={() => setItemToEquip(item)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">Equip</button>}
                    </div>
                  </div>
                </ItemCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-white bg-black/50 p-10 rounded-lg">
            <p>Your inventory is empty.</p>
          </div>
        )}
      </div>
      </div>

      {itemToUse && <UseItemModal item={itemToUse} onClose={() => setItemToUse(null)} />}
      {itemToEquip && <EquipmentModal item={itemToEquip} onClose={() => setItemToEquip(null)} />}
    </div>
  );
}