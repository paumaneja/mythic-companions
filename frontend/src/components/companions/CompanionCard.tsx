import { Link } from 'react-router-dom';
import type { CompanionCardDto } from '../../types';

interface CompanionCardProps {
  companion: CompanionCardDto;
}

const StatusIndicator = ({ status }: { status: string }) => {
  const colorMap: { [key: string]: string } = {
    ACTIVE: 'bg-green-500',
    SICK: 'bg-yellow-500',
    HOSPITALIZED: 'bg-red-500',
  };
  return <span className={`absolute top-2 right-2 h-4 w-4 rounded-full ${colorMap[status] || 'bg-gray-400'}`}></span>;
};

export default function CompanionCard({ companion }: CompanionCardProps) {
  return (
    <Link to={`/sanctuary/${companion.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img src={companion.imageUrl} alt={companion.name} className="w-full h-48 object-cover" />
        <StatusIndicator status={companion.status} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{companion.name}</h3>
        <p className="text-sm text-gray-600">{companion.speciesId}</p>
      </div>
    </Link>
  );
}