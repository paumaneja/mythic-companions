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
  return (<div className="absolute top-3 right-3 h-4 w-4 rounded-full border-2 border-white shadow" style={{ backgroundColor: colorMap[status] || 'bg-gray-400' }}></div>);
};

export default function CompanionCard({ companion }: CompanionCardProps) {
  return (
    <Link to={`/sanctuary/${companion.id}`} className="block bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <img src={companion.imageUrl} alt={companion.name} className="w-full h-48 object-cover" />
        <StatusIndicator status={companion.status} />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{companion.name}</h3>
        <p className="text-md text-gray-600 capitalize">{companion.speciesId.toLowerCase().replace('_', ' ')}</p>
      </div>
    </Link>
  );
}