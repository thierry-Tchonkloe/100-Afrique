// src/components/emploi/ProfileStrengthRing.tsx
'use client';

interface ProfileStrengthRingProps {
  percentage: number;
}

export default function ProfileStrengthRing({ percentage }: ProfileStrengthRingProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36" cy="36" r={radius}
          fill="none" stroke="#F3F4F6" strokeWidth="5"
          strokeDasharray="4 4"
        />
        <circle
          cx="36" cy="36" r={radius}
          fill="none" stroke="#E8622A" strokeWidth="5"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
}