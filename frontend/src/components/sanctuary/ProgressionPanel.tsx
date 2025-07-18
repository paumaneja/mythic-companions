import type { ProgressionDto } from '../../types';
import StatBar from '../ui/StatBar';

interface ProgressionPanelProps {
  progression: ProgressionDto;
}

export default function ProgressionPanel({ progression }: ProgressionPanelProps) {
  const xpForCurrentLevel = progression.totalXp - progression.currentXpInLevel;
  const xpNeededForNextLevel = progression.xpForNextLevel - xpForCurrentLevel;

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-lg shadow-lg text-white h-full flex flex-col">
      <h2 className="text-center text-2xl font-bold mb-4 border-b border-white/20 pb-2">Progression</h2>
      <div className="flex-1 flex items-center justify-between gap-4">
          <div className="text-center pl-6">
            <p className="text-lg text-gray-600">Level</p>
            <p className="text-5xl font-bold text-gray-900">{progression.level}</p>
          </div>
          <div className="h-3/4 pr-6">
            <StatBar
              label="XP"
              value={progression.currentXpInLevel}
              maxValue={xpNeededForNextLevel}
              colorClass="bg-purple-500"
              orientation='vertical'
            />
          </div>
      </div>  
    </div>
  );
}