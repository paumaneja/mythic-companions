import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { CompanionCardDto } from '../types';
import { useAuthStore } from '../stores/authStore';
import CompanionCard from '../components/companions/CompanionCard';
import { Link } from 'react-router-dom';

const fetchCompanions = async (token: string | null): Promise<CompanionCardDto[]> => {
  if (!token) throw new Error('No auth token found');

  const response = await apiClient.get('/companions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default function SchoolPage() {
  const token = useAuthStore((state) => state.token);

  const { data: companions, isLoading, isError, error } = useQuery({
    queryKey: ['companions'], // Una clau única per a aquesta consulta
    queryFn: () => fetchCompanions(token),
    enabled: !!token, // La consulta només s'executarà si existeix un token
  });

  if (isLoading) {
    return <div className="text-center p-10">Loading your companions...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Companions</h1>
         {/* TODO: Aquest botó obrirà el modal d'adopció */}
        <Link to="/adopt" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          + Adopt New
        </Link>
      </div>

      {companions && companions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companions.map((companion) => (
            <CompanionCard key={companion.id} companion={companion} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-10 rounded-lg shadow">
          <p className="text-gray-600">You don't have any companions yet. Time to adopt one!</p>
        </div>
      )}
    </div>
  );
}