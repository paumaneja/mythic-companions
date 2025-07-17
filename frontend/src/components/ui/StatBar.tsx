interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  colorClass: string;
}

export default function StatBar({ label, value, maxValue = 100, colorClass }: StatBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-700">{value} / {maxValue}</span>
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