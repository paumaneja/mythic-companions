import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import type { Item, MinigameResultDto, SubmitScoreResponseDto } from '../../types';
import MinigameResultModal from '../../components/minigames/MinigameResultModal';
import { createMemoryDeck, type MemoryCard as MemoryCardType } from '../../lib/gameUtils';
import MemoryCard from '../../components/minigames/MemoryCard';
import MinigamesBackgroundImage from '../../assets/images/minigames-background.png';

type GameState = 'WELCOME' | 'PLAYING' | 'FINISHED';
const GAME_DURATION = 90;
const GRID_SIZE = 16;

export default function MemoryGamePage() {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [cards, setCards] = useState<MemoryCardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameResult, setGameResult] = useState<MinigameResultDto | null>(null);

  const { data: allItems, isLoading: isLoadingItems, isError, error } = useQuery({ 
    queryKey: ['allItemsForMemory'], 
    queryFn: () => apiClient.get<Item[]>('/game-data/items').then(res => res.data) 
  });
  
  const { mutate: submitScore, isPending: isSubmitting } = useMutation<SubmitScoreResponseDto, Error, number>({
    mutationFn: (finalScore: number) => 
      apiClient.post('/minigames/submit-score', { gameId: 'MEMORY_GAME', score: finalScore }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data),
    onSuccess: (data) => {
      setGameResult(data.gameResult);
      if (token) setToken(token, data.user);
    },
  });

  // Efecte per al temporitzador del joc
  useEffect(() => {
    if (gameState !== 'PLAYING' || timeLeft <= 0) return;
    if (cards.length > 0 && cards.every(c => c.isMatched)) return;

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    
    if (timeLeft === 0) {
      clearInterval(timer);
      setGameState('FINISHED');
      submitScore(0);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, cards, submitScore]);

  // Efecte per comprovar les parelles
  useEffect(() => {
    if (flippedCards.length < 2) return;

    setIsChecking(true);
    setMoves(m => m + 1);
    const [firstCardId, secondCardId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstCardId);
    const secondCard = cards.find(c => c.id === secondCardId);

    if (firstCard && secondCard && firstCard.itemId === secondCard.itemId) {
      setCards(prev => prev.map(card => 
        card.itemId === firstCard.itemId ? { ...card, isMatched: true } : card
      ));
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card
        ));
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [flippedCards, cards]);

  // Efecte per comprovar la victòria
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
        setGameState('FINISHED');
        const score = Math.max(0, (timeLeft * 10) - moves);
        submitScore(score);
    }
  }, [cards, timeLeft, moves, submitScore]);

  const handleStart = () => {
    if (allItems) {
      setCards(createMemoryDeck(allItems, GRID_SIZE));
      setMoves(0);
      setFlippedCards([]);
      setTimeLeft(GAME_DURATION);
      setGameResult(null);
      setGameState('PLAYING');
    }
  };

  const handleCardClick = (clickedCard: MemoryCardType) => {
    if (isChecking || flippedCards.length >= 2 || clickedCard.isFlipped || clickedCard.isMatched) return;
    
    const newCards = cards.map(card => card.id === clickedCard.id ? { ...card, isFlipped: true } : card);
    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard.id]);
  };

  if (isError) {
    return <div className="text-center text-red-400">Error loading game assets: {error.message}</div>;
  }

  if (gameState === 'WELCOME') {
    return (
        <div className="text-center text-white">
            <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            >
            <h1 className="text-4xl font-bold">Memory Game</h1>
            <p className="mt-4 mb-8">Find all the matching pairs before time runs out!</p>
            <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-xl" disabled={isLoadingItems}>
                {isLoadingItems ? 'Loading Assets...' : 'Start Game'}
            </button>
            </div>
        </div>    
    );
  }

  if (gameState === 'FINISHED') {
    if (isSubmitting) return <div className="text-white text-center">Submitting score...</div>;
    if (gameResult) return (
        <div className="relative h-full w-full flex flex-col">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed" 
                style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            ></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <MinigameResultModal 
            result={gameResult} 
            onPlayAgain={handleStart}
            onExit={() => navigate('/minigames')}
            />
        </div>
    );
    return <div className="text-white text-center">Calculating results...</div>
  }
  
  return (
    <div className="relative h-full w-full flex flex-col">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto">
            <div className='flex justify-between items-center mb-4 text-white text-2xl font-bold'>
                <div>Time: <span className="font-mono">{timeLeft}s</span></div>
                <div>Moves: <span className="font-mono">{moves}</span></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {cards.map(card => (
                    <MemoryCard key={card.id} card={card} onCardClick={handleCardClick} isDisabled={isChecking} />
                ))}
            </div>
        </div>
    </div>
  );
}