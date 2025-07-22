import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import type { RankingDto } from '../../types';

interface Props {
  gameId: string;
}

const fetchRanking = async (gameId: string): Promise<RankingDto[]> => {
  const { data } = await apiClient.get(`/minigames/ranking/${gameId}`);
  return data;
};

export default function RankingList({ gameId }: Props) {
  const { user } = useAuthStore();
  const { data: ranking, isLoading } = useQuery({
    queryKey: ['ranking', gameId],
    queryFn: () => fetchRanking(gameId),
  });

  if (isLoading) return <div className="text-sm text-gray-400">Loading ranking...</div>;
  if (!ranking) return null;

  const playerEntry = ranking.find(e => e.username === user?.username);
  const playerRank = playerEntry ? ranking.indexOf(playerEntry) + 1 : null;
  const isPlayerInTop3 = playerRank !== null && playerRank <= 3;

  return (
    <div className="mt-4 border-t border-gray-600 pt-4">
      <h4 className="font-bold text-lg mb-2">Top 3 Ranking</h4>
      <ol className="list-decimal list-inside space-y-1">
        {ranking.slice(0, 3).map((entry, index) => (
          <li key={entry.username} className={`flex justify-between p-1 rounded ${entry.username === user?.username ? 'bg-yellow-500/30' : ''}`}>
            <span>{index + 1}. {entry.username}</span>
            <span className="font-bold">{entry.score} pts</span>
          </li>
        ))}
      </ol>
      {playerEntry && !isPlayerInTop3 && (
        <div className="mt-2 border-t border-dashed border-gray-500 pt-2">
             <div className="flex justify-between p-1 rounded bg-yellow-500/30">
                <span>{playerRank}. {playerEntry.username} (You)</span>
                <span className="font-bold">{playerEntry.score} pts</span>
             </div>
        </div>
      )}
    </div>
  );
}