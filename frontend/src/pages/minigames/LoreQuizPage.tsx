import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import type { LoreQuestion, MinigameResultDto, SubmitScoreResponseDto } from '../../types';
import MinigameResultModal from '../../components/minigames/MinigameResultModal';
import MinigamesBackgroundImage from '../../assets/images/minigames-background.png';

type GameState = 'WELCOME' | 'PLAYING' | 'SHOWING_FEEDBACK' | 'FINISHED';
const TOTAL_QUESTIONS = 5;

const fetchQuizData = async (): Promise<Record<string, LoreQuestion[]>> => {
  const { data } = await apiClient.get('/game-data/lore-quiz');
  return data;
};

export default function LoreQuizPage() {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [questions, setQuestions] = useState<LoreQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameResult, setGameResult] = useState<MinigameResultDto | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const { data: quizData, isLoading: isLoadingQuiz } = useQuery({ queryKey: ['loreQuiz'], queryFn: fetchQuizData });
  const { mutate: submitScore, isPending: isSubmitting } = useMutation<SubmitScoreResponseDto, Error, number>({
    mutationFn: (finalScore: number) => 
      apiClient.post('/minigames/submit-score', { gameId: 'LORE_QUIZ', score: finalScore }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.data),
    onSuccess: (data) => {
      setGameResult(data.gameResult);
      if (token) setToken(token, data.user);
    },
  });

  const handleStart = () => {
    if (!quizData) return;
    const universes = Object.keys(quizData);
    const randomUniverse = universes[Math.floor(Math.random() * universes.length)];
    const shuffledQuestions = [...quizData[randomUniverse]].sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions.slice(0, TOTAL_QUESTIONS));

    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswerIndex(null);
    setGameResult(null);
    setGameState('PLAYING');
  };

  const handleAnswer = (selectedIndex: number) => {
    if (gameState !== 'PLAYING') return;

    setSelectedAnswerIndex(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);

    setGameState('SHOWING_FEEDBACK');

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(i => i + 1);
        setFeedback(null);
        setSelectedAnswerIndex(null);
        setGameState('PLAYING');
      } else {
        setGameState('FINISHED');
      }
    }, 1500);
  };

  useEffect(() => {
    if (gameState === 'FINISHED') {
      submitScore(score);
    }
  }, [gameState, score, submitScore]);

  const currentQuestion = questions[currentQuestionIndex];

  if (gameState === 'WELCOME') {
    return (
        <div className="text-center text-white font-tomorrow">
            <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            >
            <h1 className="pt-20 text-4xl font-bold">Lore Quiz</h1>
            <p className="mt-8 mb-8">Test your knowledge and earn rewards!</p>
            <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-xl" disabled={isLoadingQuiz}>
                {isLoadingQuiz ? 'Loading Questions...' : 'Start Game'}
            </button>
            </div>
        </div>
    );
  }

  if (gameState === 'FINISHED') {
    if (isSubmitting) return <div className="text-white text-center font-tomorrow">Submitting score...</div>;
    if (gameResult) return (
        <div className="relative h-full w-full flex flex-col font-tomorrow">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed" 
                style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
            ></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <MinigameResultModal 
                result={gameResult}
                gameId="LORE_QUIZ"
                onPlayAgain={handleStart}
                onExit={() => navigate('/minigames')}
            />
        </div>
    );
    return <div className="text-white text-center font-tomorrow">Submitting score...</div>;
  }

  return (
    <div className="relative h-full w-full flex flex-col font-tomorrow">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${MinigamesBackgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="pt-10 relative z-10 w-full max-w-4xl mx-auto text-white">
            {currentQuestion && (
            <>
                <div className="text-center mb-4">
                    <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h2 className="text-2xl font-bold p-4">{currentQuestion.question}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        let buttonClass = "bg-blue-600 hover:bg-blue-700";
                            if (feedback) {
                                if (index === currentQuestion.correctAnswer) {
                                    buttonClass = "bg-green-500 animate-pulse";
                                } else if (index === selectedAnswerIndex) {
                                    buttonClass = "bg-red-500";
                                }
                            }

                            return (
                                <button 
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={gameState === 'SHOWING_FEEDBACK'}
                                    className={`p-4 rounded-lg text-white font-semibold transition-colors ${buttonClass} disabled:opacity-70`}
                                >
                                {option}
                                </button>
                            );
                    })}
                </div>
            </>
            )}
        </div>
    </div>
  );
}