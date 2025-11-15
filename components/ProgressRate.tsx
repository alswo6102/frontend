interface ProgressRateProps {
  current: number;
  total: number;
}

export default function ProgressRate({ current, total }: ProgressRateProps) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full bg-white p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="h-2 rounded-full" style={{ backgroundColor: '#FF6F00', width: `${percent}%`, transition: 'width 0.3s' }}
        />
      </div>
    </div>
  );
}
