interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  colorClass: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function StatBar({ label, value, maxValue = 100, colorClass, orientation = 'horizontal' }: StatBarProps) {
  const percentage = (value / maxValue) * 100;

  if (orientation === 'horizontal') {
    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="text-sm font-semibold text-white">{value} / {maxValue}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-4 h-full bg-gray-200 rounded-full flex flex-col-reverse relative overflow-hidden">
        <div
          className={`w-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ height: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs font-semibold text-gray-700 mt-1">{label}</span>
      <span className="text-sm font-semibold text-gray-700">{value} / {maxValue}</span>
    </div>
  );
}