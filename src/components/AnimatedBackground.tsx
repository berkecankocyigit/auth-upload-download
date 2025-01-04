import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate relative mouse position with increased movement range
      const moveX = (clientX / innerWidth) * 40 - 20; // Doubled range
      const moveY = (clientY / innerHeight) * 40 - 20; // Doubled range

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
        {/* Larger gradient blobs with increased opacity */}
        <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-[-10%] right-[-20%] w-[700px] h-[700px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[900px] h-[900px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
};

export default AnimatedBackground;