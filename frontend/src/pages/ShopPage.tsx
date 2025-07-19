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
            // Actualitzem la nostra botiga global (el "marcador central") amb les noves dades
            setToken(token, updatedUser);
        }

        // Invalidem la query de l'inventari per si l'usuari hi navega després
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      alert(`Purchase failed: ${error.response?.data?.error || 'Unknown error'}`);
    }
  });

  if (isLoading) return <div className="text-center p-10">Loading shop...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Could not load shop items.</div>;

  return (
    // Contenidor principal que ocupa tota l'alçada disponible dins del PrivateLayout
    <div className="relative h-full w-full">
      {/* Capa 1: La imatge de fons. Està fixada i ocupa tot l'espai. */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${ShopBackgroundImage})` }}
      ></div>

      {/* Capa 2 (Opcional): Un filtre fosc per millorar la llegibilitat */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Capa 3: El contingut que es pot desplaçar (scroll) */}
      <div className="relative z-10 h-full overflow-y-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">Item Shop</h1>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items?.map((item) => (
                <ItemCard 
                    key={item.itemId}
                    item={item}
                    onBuy={() => buyMutation.mutate(item.itemId)}
                    isBuying={buyMutation.isPending && buyMutation.variables === item.itemId}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}