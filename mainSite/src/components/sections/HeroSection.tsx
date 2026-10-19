import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonAction: () => void;
  secondaryButtonAction: () => void;
  imageSrc: string;
  imageAlt: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonAction,
  secondaryButtonAction,
  imageSrc,
  imageAlt,
}) => {
  return (
    <Container maxWidth="2xl" className="py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={primaryButtonAction}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
            >
              <span>{primaryButtonText}</span>
              <FaArrowRight />
            </button>
            <button
              onClick={secondaryButtonAction}
              className="inline-flex items-center gap-3 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{secondaryButtonText}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full h-auto max-h-96 object-contain rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </Container>
  );
};