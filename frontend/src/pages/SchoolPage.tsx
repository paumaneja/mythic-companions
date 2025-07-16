import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { CompanionCardDto } from '../types';
import { useAuthStore } from '../stores/authStore';
import CompanionCard from '../components/companions/CompanionCard';

const fetchCompanions = async (token: string | null): Promise<CompanionCardDto[]> => {
  const { data } = await apiClient.get('/companions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export default function SchoolPage() {
  const token = useAuthStore((state) => state.token);

  const { data: companions, isLoading, error } = useQuery({
    queryKey: ['companions'],
    queryFn: () => fetchCompanions(token),
    enabled: !!token,
  });

  if (isLoading) {
    return <div>Loading your companions...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Companions</h1>

      {companions && companions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companions.map((companion) => (
            <CompanionCard key={companion.id} companion={companion} />
          ))}
          {/* TODO: Add 'Adopt New' card here */}
        </div>
      ) : (
        <p>You don't have any companions yet. Time to adopt one!</p>
      )}
    </div>
  );
}