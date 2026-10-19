import React from 'react';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { FaEnvelope } from 'react-icons/fa';

interface PlacementData {
  company: string;
  role: string;
  package: string;
  year: string;
}

interface TPOSectionProps {
  title: string;
  subtitle: string;
  contactEmail: string;
  placements: PlacementData[];
  stats?: {
    totalPlacements: number;
    averagePackage: string;
    topPackage: string;
  };
}

export const TPOSection: React.FC<TPOSectionProps> = ({
  title,
  subtitle,
  contactEmail,
  placements,
  stats,
}) => {
  return (
    <div className="py-16 lg:py-24 bg-white">
      <Container maxWidth="6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalPlacements}</div>
              <div className="text-sm text-gray-600">Total Placements</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.averagePackage}</div>
              <div className="text-sm text-gray-600">Average Package</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.topPackage}</div>
              <div className="text-sm text-gray-600">Highest Package</div>
            </Card>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {placements.map((placement, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{placement.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{placement.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{placement.package}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{placement.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600 text-2xl" />
              <div className="text-left">
                <div className="text-sm text-gray-600 mb-1">Contact TPO</div>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};