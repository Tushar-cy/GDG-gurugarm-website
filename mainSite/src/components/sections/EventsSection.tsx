import React from 'react';
import { Container } from '../ui/Container';
import { Grid } from '../ui/Grid';
import { Button } from '../ui/Button';
import { EventCard } from '../EventCard';
import { Event } from '../../types/event';

interface EventsSectionProps {
  title: string;
  subtitle: string;
  events: Event[];
  onViewAll: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  title,
  subtitle,
  events,
  onViewAll,
}) => {
  return (
    <div className="py-16 lg:py-24">
      <Container maxWidth="6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <Grid cols={1} mdCols={2} lgCols={3} gap={6}>
          {events.slice(0, 6).map((event, index) => (
            <EventCard key={event.id} event={event} delay={index * 0.1} />
          ))}
        </Grid>

        <div className="text-center mt-12">
          <Button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Events
          </Button>
        </div>
      </Container>
    </div>
  );
};