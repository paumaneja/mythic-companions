import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { CompanionCardDto } from '../types';
import { useAuthStore } from '../stores/authStore';
import CompanionCard from '../components/companions/CompanionCard';
import CompanionAdoptionCard from '../components/companions/CompanionAdoptionCard';
import SchoolBackgroundImage from '../assets/images/school-background.jpg';

const fetchCompanions = async (token: string | null): Promise<CompanionCardDto[]> => {
  if (!token) return [];
  const { data } = await apiClient.get('/companions', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export default function SchoolPage() {
  const token = useAuthStore((state) => state.token);
  const { data: companions, isLoading, isError, error } = useQuery({
    queryKey: ['companions'],
    queryFn: () => fetchCompanions(token),
    enabled: !!token,
  });

  if (isLoading) return <div className="text-center p-10">Loading your companions...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">An error occurred: {error.message}</div>;

  const existingSpeciesIds = companions ? companions.map(c => c.speciesId) : [];

  return (
    <div className="p-6 bg-cover bg-center min-h-full" style={{ backgroundImage: `url(${SchoolBackgroundImage})` }}>
      <div className="container mx-auto p-8">
        <h1 className="text-center text-3xl font-bold mb-6 p-6 text-gray-800">Your Companions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {companions?.map((companion) => (
            <CompanionCard key={companion.id} companion={companion} />
          ))}
          {/* We render the adoption card if the user has less than 6 companions */}
          {companions && companions.length < 6 && (
            <CompanionAdoptionCard existingSpeciesIds={existingSpeciesIds} />
          )}
        </div>
      </div>
    </div>
  );
}