import { useNavigate } from 'react-router-dom';
import {
  FaMicrophone,
  FaNetworkWired,
  FaLightbulb,
  FaPuzzlePiece,
  FaArrowRight,
  FaCalendarAlt,
  FaUsers,
  FaCode
} from 'react-icons/fa';
import { AnimatedOrbs } from '../components/AnimatedOrbs';

const Home = () => {
  const navigate = useNavigate();

  const features = [
                {
                  icon: FaMicrophone,
                  title: 'Tech Talks',
                  description: 'Learn from industry experts and Google Developer Experts.',
                },
                {
                  icon: FaNetworkWired,
                  title: 'Networking',
      description: 'Connect with developers and tech enthusiasts.',
                },
                {
                  icon: FaLightbulb,
                  title: 'Workshops',
      description: 'Hands-on sessions with new technologies.',
                },
                {
                  icon: FaPuzzlePiece,
                  title: 'Hackathons',
      description: 'Build innovative solutions together.',
    }
  ];

  const stats = [
    { icon: FaUsers, value: '500+', label: 'Members' },
    { icon: FaCalendarAlt, value: '50+', label: 'Events' },
    { icon: FaCode, value: '100+', label: 'Projects' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light with frosted glass orbs */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 relative overflow-hidden">
        {/* Animated frosted glass orbs background */}
        {/* <AnimatedOrbs /> */}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-900">
                Welcome to <span className="block mt-2">GDG Gurugram</span> <span className="block mt-2">University</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
                A community of developers learning, building, and growing together with Google technologies.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  View Events
                  <FaArrowRight className="text-sm" />
                </button>
                <button
                  onClick={() => navigate('/team')}
                  className="inline-flex items-center gap-2 border-2 border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 px-7 py-3.5 rounded-full font-medium hover:bg-white/80 transition-all"
                >
                  Meet the Team
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-3xl blur-2xl"></div>
                <img
                  src="/images/HEROiMAGE.png"
                  alt="GDG Community"
                  className="w-full max-w-md relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Stats - Frosted glass cards */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200/50 hover:bg-white/80 transition-all">
                <stat.icon className="mx-auto text-3xl text-blue-600 mb-3" />
                <div className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100/50 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-4">
              Our Community
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community for events, workshops, and opportunities to grow your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100/50 backdrop-blur-sm rounded-full text-purple-600 text-sm font-medium mb-4">
              Our Journey
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Event Highlights
            </h2>
            <p className="text-lg text-gray-600">
              Moments from our community gatherings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-3xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                
                <img
                  src="/images/HEROiMAGE.png"
                  alt={`Event ${index}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Hover text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <h4 className="font-bold text-lg mb-1">Community Event</h4>
                  <p className="text-sm text-gray-200">Tech Talk & Workshop</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-medium"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-[2.5rem] p-12 lg:p-16 overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                  Get Started Today
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Join Our Community
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Get involved with GDG Gurugram University and connect with developers who are passionate about technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/events')}
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Browse Events
                    <FaArrowRight className="text-sm" />
                  </button>
                  <button
                    onClick={() => navigate('/team')}
                    className="inline-flex items-center gap-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all"
                  >
                    Meet the Team
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all"></div>
                  <div className="relative w-72 h-72 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-105 transition-transform">
                  <img
                    src="/images/t2k7QK3r_400x400.png"
                      alt="GDG Logo"
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;