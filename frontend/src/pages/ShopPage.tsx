import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { Item, UserDto } from '../types';
import ItemCard from '../components/shop/ItemCard';
import { useAuthStore } from '../stores/authStore';
import { AxiosError } from 'axios';
import ShopBackgroundImage from '../assets/images/shop-background.png';

const fetchShopItems = async (): Promise<Item[]> => {
  const { data } = await apiClient.get('/shop/items');
  return data;
};

type ApiError = { error: string };

export default function ShopPage() {
  const queryClient = useQueryClient();
  const { token, setToken } = useAuthStore();
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['shopItems'],
    queryFn: fetchShopItems,
  });

  const buyMutation = useMutation<UserDto, AxiosError<ApiError>, string>({
    mutationFn: (itemId: string) => apiClient.post(`/shop/buy/${itemId}`, { quantity: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data),
    onSuccess: (updatedUser) => {
        console.log("Data received after purchase:", updatedUser);
        alert('Purchase successful!');
        if (token) {
            setToken(token, updatedUser);
        }

        queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      alert(`Purchase failed: ${error.response?.data?.error || 'Unknown error'}`);
    }
  });

  if (isLoading) return <div className="text-center p-10">Loading shop...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Could not load shop items.</div>;

  return (
    <div className="relative h-full w-full flex flex-col">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${ShopBackgroundImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative h-full flex flex-col font-tomorrow">
        <header className="p-6">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">Item Shop</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items?.map((item) => (
              <ItemCard key={item.itemId} item={item}>
                <p className="text-lg font-bold text-yellow-400 mb-2">{item.price} Coins</p>
                <button
                  onClick={() => buyMutation.mutate(item.itemId)}
                  disabled={buyMutation.isPending && buyMutation.variables === item.itemId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500"
                >
                {buyMutation.isPending && buyMutation.variables === item.itemId ? 'Buying...' : 'Buy'}
                </button>
              </ItemCard>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}