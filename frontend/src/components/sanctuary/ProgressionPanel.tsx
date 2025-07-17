import type { ProgressionDto } from '../../types';
import StatBar from '../ui/StatBar';

interface ProgressionPanelProps {
  progression: ProgressionDto;
}

export default function ProgressionPanel({ progression }: ProgressionPanelProps) {
  const xpForCurrentLevel = progression.totalXp - progression.currentXpInLevel;
  const xpNeededForNextLevel = progression.xpForNextLevel - xpForCurrentLevel;

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Progression</h2>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Level</p>
          <p className="text-5xl font-bold text-gray-900">{progression.level}</p>
        </div>
        <StatBar
          label="XP"
          value={progression.currentXpInLevel}
          maxValue={xpNeededForNextLevel}
          colorClass="bg-purple-500"
        />
      </div>
    </div>
  );
}