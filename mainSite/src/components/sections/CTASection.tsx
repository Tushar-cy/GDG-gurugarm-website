import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  buttonText,
  buttonAction,
}) => {
  return (
    <div className="py-16 lg:py-24">
      <Container maxWidth="4xl">
        <div className="relative bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight animate-fade-in-up">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
              {subtitle}
            </p>
            <Button
              onClick={buttonAction}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-lg animate-fade-in-up animation-delay-200"
            >
              <span>{buttonText}</span>
              <FaArrowRight />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};