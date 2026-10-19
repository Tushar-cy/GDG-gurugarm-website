import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';
import { Chip } from './Chip';

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

interface TeamCardProps {
  member: TeamMember;
  delay?: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member, delay = 0 }) => {
  const handleSocialClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 flex flex-col items-center text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative mb-4">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-24 h-24 rounded-full border-4 border-blue-100 object-cover shadow-sm transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 w-full space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {member.name}
        </h3>

        <p className="text-sm font-semibold text-blue-600">
          {member.role}
        </p>

        <p className="text-sm text-gray-600 leading-relaxed">
          {member.description}
        </p>

        {member.tags && member.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {member.tags.map((tag, index) => (
              <Chip key={index} className="text-xs">{tag}</Chip>
            ))}
          </div>
        )}

        {member.socialLinks && (
          <div className="flex items-center justify-center gap-2">
            {member.socialLinks.linkedin && (
              <button
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                onClick={() => handleSocialClick(member.socialLinks?.linkedin)}
              >
                <FaLinkedin size={16} />
              </button>
            )}
            {member.socialLinks.twitter && (
              <button
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                onClick={() => handleSocialClick(member.socialLinks?.twitter)}
              >
                <FaTwitter size={16} />
              </button>
            )}
            {member.socialLinks.github && (
              <button
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                onClick={() => handleSocialClick(member.socialLinks?.github)}
              >
                <FaGithub size={16} />
              </button>
            )}
            {member.socialLinks.website && (
              <button
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                onClick={() => handleSocialClick(member.socialLinks?.website)}
              >
                <FaGlobe size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};