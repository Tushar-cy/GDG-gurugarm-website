import React from 'react';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
}) => {
  return (
    <div
      className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 h-full flex flex-col items-center text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={28} />
      </div>

      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};