import type { MinigameResultDto } from '../../types';

interface Props {
  result: MinigameResultDto;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function MinigameResultModal({ result, onPlayAgain, onExit }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4">{result.isNewHighScore ? 'New High Score!' : 'Game Over!'}</h2>
        <p className="text-xl mb-4">Your score: <span className="font-bold text-yellow-400">{result.finalScore}</span></p>

        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Rewards</h3>
          <p>You earned <span className="font-bold text-yellow-400">{result.rewards.mythicCoins}</span> MythicCoins!</p>
          {result.rewards.awardedItemId && (
            <p className="mt-2">You found an item: <span className="font-bold text-green-400">{result.rewards.awardedItemId}</span>!</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onPlayAgain} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Play Again</button>
          <button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Exit</button>
        </div>
      </div>
    </div>
  );
}