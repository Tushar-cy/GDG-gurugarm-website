import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  NewspaperIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  UsersIcon as UsersIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
} from '@heroicons/react/24/solid';

export const MobileDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];

  const dockItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid 
    },
    { 
      path: '/events', 
      label: 'Events', 
      icon: CalendarIcon, 
      iconSolid: CalendarIconSolid 
    },
    { 
      path: '/team', 
      label: 'Team', 
      icon: UsersIcon, 
      iconSolid: UsersIconSolid 
    },
    { 
      path: '/news', 
      label: 'News', 
      icon: NewspaperIcon, 
      iconSolid: NewspaperIconSolid 
    },
    { 
      path: '/tpo', 
      label: 'TPO', 
      icon: BriefcaseIcon, 
      iconSolid: BriefcaseIconSolid 
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
      {/* Modern iOS-style dock */}
      <div className="bg-white/90 backdrop-blur-3xl border border-gray-200/60 rounded-[32px] px-4 py-4 shadow-2xl shadow-gray-900/10">
        <div className="flex items-center justify-between gap-1">
          {dockItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = isActive ? item.iconSolid : item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isActive 
                    ? 'flex-1' 
                    : 'w-14'
                }`}
              >
                {/* Icon container with smooth transitions */}
                <div
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-full h-12 rounded-[20px] bg-gray-900 shadow-lg shadow-gray-900/20'
                      : 'w-12 h-12 rounded-[18px] bg-transparent hover:bg-gray-100'
                  }`}
                >
                  {/* Icon */}
                  <Icon
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'w-5 h-5 text-white' 
                        : 'w-6 h-6 text-gray-600 group-hover:text-gray-900'
                    }`}
                  />
                  
                  {/* Label for active item */}
                  {isActive && (
                    <span className="ml-2 text-sm font-semibold text-white whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
