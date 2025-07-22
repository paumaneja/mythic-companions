import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import type { MinigameResultDto, SubmitScoreResponseDto } from '../../types';
import MinigameResultModal from '../../components/minigames/MinigameResultModal';
import MinigamesBackgroundImage from '../../assets/images/minigames-background.png';

type GameState = 'WELCOME' | 'PLAYING' | 'FINISHED';
const GAME_DURATION = 20;
const TARGET_MOVE_INTERVAL = 800;

export default function ClickerGamePage() {
  const navigate = useNavigate();
  const { user, token, setToken } = useAuthStore();
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const [gameResult, setGameResult] = useState<MinigameResultDto | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const { mutate: submitScore, isPending: isSubmitting } = useMutation<SubmitScoreResponseDto, Error, number>({
    mutationFn: (finalScore: number) => 
      apiClient.post('/minigames/submit-score', { gameId: 'CLICKER_GAME', score: finalScore }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data),
    onSuccess: (data) => {
      setGameResult(data.gameResult);
      if (token) {
        setToken(token, data.user);
      }
    },
  });

  useEffect(() => {
    if (gameState !== 'PLAYING') {
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameState('FINISHED');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveTarget = () => {
      if (gameAreaRef.current) {
        const area = gameAreaRef.current.getBoundingClientRect();
        const newTop = Math.random() * (area.height - 80);
        const newLeft = Math.random() * (area.width - 80);
        setTargetPosition({ top: `${newTop}px`, left: `${newLeft}px` });
      }
    };

    const moveInterval = setInterval(moveTarget, TARGET_MOVE_INTERVAL);
    return () => clearInterval(moveInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'FINISHED') {
      submitScore(score);
    }
  }, [gameState, score, submitScore]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('PLAYING');
  };

  const handleTargetClick = () => {
    if (gameState === 'PLAYING') {
      setScore(prev => prev + 1);
    }
  };

  if (gameState === 'WELCOME') {
    return (
        <div className="text-center text-white">
            <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            >
            <h1 className="text-4xl font-bold">Clicker Game</h1>
            <p className="mt-4 mb-8">Click on your moving avatar as many times as you can in 20 seconds!</p>
            <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-xl">Start Game</button>
            </div>
        </div>
    );
  }

  if (gameState === 'FINISHED') {
    if (isSubmitting) return <div>Submitting score...</div>;
    if (gameResult) return (
        <div className="relative h-full w-full flex flex-col">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed" 
                style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            ></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <MinigameResultModal 
                result={gameResult}
                gameId="CLICKER_GAME"
                onPlayAgain={handleStart}
                onExit={() => navigate('/minigames')}
            />
        </div>
    );
    return <div>Error submitting score.</div>
  }

  return (
    <div className="relative h-full w-full flex flex-col">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto">
            <div className='flex justify-between items-center mb-4 text-white text-2xl mt-10'>
                <div>Time Left: <span className="font-bold text-white">{timeLeft}s</span></div>
                <div>Score: <span className="font-bold text-white">{score}</span></div>
            </div>

            <div ref={gameAreaRef} className="relative w-full h-[60vh] bg-black/80 rounded-lg overflow-hidden mt-10">
                <button 
                    onClick={handleTargetClick}
                    className="absolute w-20 h-20 rounded-full border-black bg-cover bg-center transition-all duration-300"
                    style={{ 
                        top: targetPosition.top, 
                        left: targetPosition.left,
                        backgroundImage: `url(${user?.avatarUrl || '/assets/images/me.jpg'})`
                    }}
                />
            </div>
        </div>
    </div>
  );
}