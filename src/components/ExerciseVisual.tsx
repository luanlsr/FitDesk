"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Loader2 } from "lucide-react";

interface ExerciseVisualProps {
  imageUrl?: string;
  videoUrl?: string;
  className?: string;
  animate?: boolean;
}

export function ExerciseVisual({ imageUrl, videoUrl, className = "", animate = true }: ExerciseVisualProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Se tivermos as duas imagens, podemos alternar entre elas para simular animação
  const frames = [imageUrl, videoUrl].filter(Boolean);

  useEffect(() => {
    if (!animate || frames.length < 2) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 600); // Velocidade da animação

    return () => clearInterval(interval);
  }, [animate, frames.length]);

  if (!imageUrl && !videoUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#0A0A0B] rounded-2xl ${className}`}>
        <Dumbbell className="w-12 h-12 text-[#16161A]" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#0A0A0B] flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={frames[currentFrame]}
          src={frames[currentFrame]}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain"
          alt="Visual do exercício"
        />
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0B]/50">
          <Loader2 className="w-8 h-8 text-[#FF5C00] animate-spin" />
        </div>
      )}

      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0B]">
          <Dumbbell className="w-12 h-12 text-[#16161A]" />
        </div>
      )}
    </div>
  );
}
