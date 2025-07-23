import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { CompanionCardDto } from '../types';
import { useAuthStore } from '../stores/authStore';
import CompanionCard from '../components/companions/CompanionCard';
import CompanionAdoptionCard from '../components/companions/CompanionAdoptionCard';
import SchoolBackgroundImage from '../assets/images/school-background.png';

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
    <div className="bg-cover bg-center min-h-full" style={{ backgroundImage: `url(${SchoolBackgroundImage})` }}>
      <div className="container mx-auto p-4">
        <h1 className="font-tomorrow font-bold text-center text-4xl p-2 text-white">Your Companions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center p-2">
          {companions?.map((companion) => (
            <CompanionCard key={companion.id} companion={companion} />
          ))}
          {companions && companions.length < 6 && (
            <CompanionAdoptionCard existingSpeciesIds={existingSpeciesIds} />
          )}
        </div>
      </div>
    </div>
  );
}