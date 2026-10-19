import React from 'react';
import { Container } from '../ui/Container';
import { Grid } from '../ui/Grid';
import { TeamCard } from '../ui/TeamCard';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  tags?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface TeamSectionProps {
  title: string;
  subtitle: string;
  members: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  title,
  subtitle,
  members,
}) => {
  return (
    <div className="py-16 lg:py-24 bg-gray-50">
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
          {members.map((member, index) => (
            <TeamCard key={member.id} member={member} delay={index * 0.1} />
          ))}
        </Grid>
      </Container>
    </div>
  );
};