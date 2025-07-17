import type { StatsDto } from '../../types';
import StatBar from '../ui/StatBar';

interface StatsPanelProps {
  stats: StatsDto;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Stats</h2>
      <div className="space-y-4">
        <StatBar label="Health" value={stats.health} colorClass="bg-red-500" />
        <StatBar label="Energy" value={stats.energy} colorClass="bg-blue-500" />
        <StatBar label="Hunger" value={stats.hunger} colorClass="bg-yellow-500" />
        <StatBar label="Happiness" value={stats.happiness} colorClass="bg-pink-500" />
        <StatBar label="Hygiene" value={stats.hygiene} colorClass="bg-cyan-500" />
      </div>
    </div>
  );
}