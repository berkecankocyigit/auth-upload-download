import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate relative mouse position with increased movement range
      const moveX = (clientX / innerWidth) * 40 - 20;
      const moveY = (clientY / innerHeight) * 40 - 20;

      // Apply smooth transform
      backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        {/* Larger gradient blobs with increased opacity and vibrant colors */}
        <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-[#0EA5E9] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-[-10%] right-[-20%] w-[700px] h-[700px] bg-[#8B5CF6] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[900px] h-[900px] bg-[#D946EF] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
};

export default AnimatedBackground;