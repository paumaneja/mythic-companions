import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import type { Minigame } from '../types';
import MinigamesBackgroundImage from '../assets/images/minigames-background.png';

const fetchMinigames = async (): Promise<Minigame[]> => {
  const { data } = await apiClient.get('/game-data/minigames');
  return data;
};

export default function MinigameSelectionPage() {
  const { data: minigames, isLoading } = useQuery({
    queryKey: ['minigames'],
    queryFn: fetchMinigames,
  });

  if (isLoading) return <div className="text-center p-10 text-white">Loading Games...</div>;

  return (
    <div className="relative h-full w-full flex flex-col font-tomorrow">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative h-full overflow-y-auto p-6">
        <header className="p-6">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">Select a Minigame</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="container mx-auto px-8">
          <div className="flex flex-col px-20 gap-6 max-w-md mx-auto">
            {minigames?.map((game) => (
              <div key={game.id} className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg shadow-lg text-center text-white flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
                <p className="text-gray-300 mb-4 flex-grow">{game.description}</p>
                {game.enabled ? (
                  <Link 
                    to={`/minigames/${game.id.toLowerCase()}`}
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center"
                  >
                    Play
                  </Link>
                ) : (
                  <button disabled className="w-full bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded cursor-not-allowed">
                    Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}