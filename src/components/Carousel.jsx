"use client";

import { useState, useEffect, useRef } from "react";

export default function Carousel({ children, autoPlay = false, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // AutoPlay
  useEffect(() => {
    resetTimeout();
    if (autoPlay) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, interval);
      return () => resetTimeout();
    }
  }, [currentIndex, autoPlay, interval]);

  // Responsive visible count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getVisibleCards = () => {
    const cards = [];
    const total = children.length;
    const half = Math.floor(visibleCount / 2);

    for (let i = -half; i <= half; i++) {
      let index = (currentIndex + i + total) % total;
      cards.push({ index, position: i });
    }

    return cards;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 pb-8 sm:pb-10 lg:pb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isAnimating}
          className="flex w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border border-white/30 hover:border-white hover:bg-white/10 items-center justify-center transition-all disabled:opacity-50 absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30"
          aria-label="Previous"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards */}
        <div className="relative flex-1 flex items-center justify-center overflow-visible h-[30rem] sm:h-[34rem] md:h-[36rem]">
          <div className="flex items-center justify-center gap-2">
            {getVisibleCards().map(({ index, position }) => (
              <div
                key={`${index}-${position}`}
                className={`transition-all duration-500 ${
                  position === 0 ? "scale-100 opacity-100 z-20" : "scale-90 opacity-70 z-10"
                }`}
                style={{
                  transform: `translateX(${position * (visibleCount === 1 ? 0 : 40)}px)`,
                }}
              >
                {children[index]}
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="flex w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border border-white/30 hover:border-white hover:bg-white/10 items-center justify-center transition-all disabled:opacity-50 absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30"
          aria-label="Next"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-7 sm:mt-6">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-[#2ACCBB] w-6" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
