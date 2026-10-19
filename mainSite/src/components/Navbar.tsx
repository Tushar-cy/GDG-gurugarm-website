import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = '/' + location.pathname.split('/')[1];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Events', path: '/events' },
    { text: 'Team', path: '/team' },
    { text: 'News', path: '/news' },
    { text: 'Gallery', path: '/gallery' },
    { text: 'TPO', path: '/tpo' },
  ];

  const adminNavItems = user ? [
    ...navItems,
    { text: 'Forms', path: '/admin/forms' },
  ] : navItems;

  const displayNavItems = adminNavItems;

  return (
    <>
      {/* Navbar - hidden on mobile, visible on desktop */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo - slides in from left when scrolled */}
            <div className={`flex items-center transition-all duration-700 ease-in-out ${
              scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
            }`}>
              <RouterLink to="/" className="flex items-center space-x-2.5 text-gray-900 no-underline">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                  <img
                    src="/images/t2k7QK3r_400x400.png"
                    alt="GDG"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">GDG GUG</span>
              </RouterLink>
            </div>

            {/* Center Navigation - Pill */}
            <div className={`hidden lg:flex items-center justify-center transition-all duration-700 ease-in-out ${
              scrolled ? 'flex-1 max-w-2xl mx-auto' : 'flex-1'
            }`}>
              <div className={`rounded-full px-2 py-2 shadow-lg transition-all duration-700 ease-in-out ${
                scrolled ? 'bg-white' : 'bg-white/95 backdrop-blur-md'
              }`}>
                <div className="flex items-center space-x-1">
                  {/* Logo in pill when at top - fades out when scrolled */}
                  <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    !scrolled ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                  }`}>
                    <RouterLink to="/" className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
                        <img
                          src="/images/t2k7QK3r_400x400.png"
                          alt="GDG"
                          className="h-5 w-5 object-contain"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">GDG GUG</span>
                    </RouterLink>
                  </div>
                  
                  {displayNavItems.map((item) => (
                    <button
                      key={item.text}
                      onClick={() => navigate(item.path)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        currentPath === item.path
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                  
                  {/* Sign in/Logout button in pill when at top - fades out when scrolled */}
                  <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    !scrolled ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                  }`}>
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="ml-2 flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all whitespace-nowrap"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/admin/login')}
                        className="ml-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions - slides in from right when scrolled */}
            <div className={`hidden lg:flex items-center space-x-3 transition-all duration-700 ease-in-out ${
              scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}>
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/admin/login')}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={handleDrawerToggle}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer - only on desktop */}
      <div className="hidden lg:block h-20"></div>
    </>
  );
}