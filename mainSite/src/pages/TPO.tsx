import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaUsers, FaBuilding, FaCheckCircle, FaAward, FaChartLine } from 'react-icons/fa';

const stats = [
  { label: 'Students Placed', value: '1200+', icon: FaBriefcase },
  { label: 'Partner Companies', value: '150+', icon: FaBuilding },
  { label: 'Average Package', value: '₹8 LPA', icon: FaCheckCircle },
  { label: 'Highest Package', value: '₹40 LPA', icon: FaGraduationCap },
];

const services = [
  { title: 'Internships', desc: 'Opportunities for students to gain real-world experience with top companies.', icon: FaBriefcase },
  { title: 'Trainings', desc: 'Industry-aligned training programs and workshops to enhance skills.', icon: FaGraduationCap },
  { title: 'Career Guidance', desc: 'Personalized mentoring, resume reviews, and interview preparation.', icon: FaUsers },
  { title: 'Company Drives', desc: 'Regular on-campus and off-campus placement drives with recruiters.', icon: FaBuilding },
];

const recruiters = [
  { name: 'Google', logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' },
  { name: 'Microsoft', logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Adobe', logo: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg' },
  { name: 'TCS', logo: 'https://www.tcs.com/content/dam/global-tcs/en/images/logo/tcs-logo.png' },
  { name: 'Infosys', logo: 'https://www.infosys.com/content/dam/infosys-web/en/global-resource/media-resources/infosys-logo-svg.svg' },
  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
  { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
];

const placements = [
  { name: 'Aman Verma', company: 'Microsoft', role: 'SDE', ctc: '₹32 LPA', avatar: 'https://ui-avatars.com/api/?name=Aman+Verma&background=2563eb&color=fff&size=100' },
  { name: 'Neha Gupta', company: 'Amazon', role: 'SDE-1', ctc: '₹28 LPA', avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=8b5cf6&color=fff&size=100' },
  { name: 'Rohit Singh', company: 'Adobe', role: 'Frontend Engineer', ctc: '₹22 LPA', avatar: 'https://ui-avatars.com/api/?name=Rohit+Singh&background=ec4899&color=fff&size=100' },
  { name: 'Priya Sharma', company: 'Google', role: 'Software Engineer', ctc: '₹35 LPA', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff&size=100' },
  { name: 'Karan Mehta', company: 'TCS', role: 'System Engineer', ctc: '₹6.5 LPA', avatar: 'https://ui-avatars.com/api/?name=Karan+Mehta&background=f59e0b&color=fff&size=100' },
];

const TPO = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float-medium"></div>
        
        <div className="max-w-[1400px] mx-auto px-8 py-20 lg:py-24 relative z-10">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-blue-100/50 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-6 animate-fade-in">
              Training & Placement Office
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Building Careers,<br />Creating Futures
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-lg lg:text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Empowering students with the right skills and opportunities to excel in their careers. Connect with top companies and unlock your potential.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 text-center hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-purple-100/50 backdrop-blur-sm rounded-full text-purple-600 text-sm font-medium mb-4 animate-fade-in">
              What We Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Comprehensive support throughout your academic journey to industry transition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, index) => (
              <div
                key={svc.title}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 text-center hover:border-purple-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svc.icon size={28} />
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-3">{svc.title}</div>
                  <div className="text-gray-600 text-sm leading-relaxed">{svc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/20 to-white border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-100/50 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-4 animate-fade-in">
              Our Partners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Top Recruiters</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Leading companies trust us to provide exceptional talent.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recruiters.map((recruiter, index) => (
              <div
                key={recruiter.name}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 flex items-center justify-center hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {recruiter.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Placements */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-100/50 backdrop-blur-sm rounded-full text-green-600 text-sm font-medium mb-4 animate-fade-in">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Recent Placements</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Celebrating the achievements of our talented students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placements.map((placement, index) => (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl overflow-hidden hover:border-green-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={placement.avatar}
                      alt={placement.name}
                      className="w-16 h-16 rounded-2xl shadow-lg"
                    />
                    <div>
                      <div className="text-lg font-bold text-gray-900">{placement.name}</div>
                      <div className="text-sm text-gray-600">{placement.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Company</div>
                      <div className="text-sm font-semibold text-gray-900">{placement.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Package</div>
                      <div className="text-lg font-bold text-green-600">{placement.ctc}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-purple-100/50 backdrop-blur-sm rounded-full text-purple-600 text-sm font-medium mb-4 animate-fade-in">
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Contact TPO</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              We are here to help you with placements, internships, and career guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Email</div>
                  <a className="text-purple-600 hover:underline font-medium" href="mailto:tpo@gugu.ac.in">
                    tpo@gugu.ac.in
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in" style={{ animationDelay: '100ms' }}>
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Phone</div>
                  <a className="text-blue-600 hover:underline font-medium" href="tel:+911234567890">
                    +91 12345 67890
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 hover:border-green-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in" style={{ animationDelay: '200ms' }}>
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Address</div>
                  <div className="text-gray-600 text-sm">Gurugram University, Sector-XX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TPO;