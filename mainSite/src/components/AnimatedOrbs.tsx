import React from 'react';

export const AnimatedOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Frosted glass orb 1 - Large */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-white/20 backdrop-blur-xl blur-2xl animate-float-slow border border-white/30"></div>
      
      {/* Frosted glass orb 2 - Medium */}
      <div className="absolute bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-white/15 backdrop-blur-xl blur-2xl animate-float-medium border border-white/20"></div>
      
      {/* Frosted glass orb 3 - Small */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-white/25 backdrop-blur-xl blur-2xl animate-float-fast border border-white/40"></div>
      
      {/* Frosted glass orb 4 - Medium */}
      <div className="absolute bottom-1/4 right-1/3 w-[420px] h-[420px] rounded-full bg-white/18 backdrop-blur-xl blur-2xl animate-float-slow border border-white/25"></div>
      
      {/* Frosted glass orb 5 - Large */}
      <div className="absolute top-1/2 right-1/2 w-[480px] h-[480px] rounded-full bg-white/22 backdrop-blur-xl blur-2xl animate-float-medium border border-white/35"></div>
    </div>
  );
};
