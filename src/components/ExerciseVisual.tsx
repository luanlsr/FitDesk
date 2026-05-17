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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isGif = videoUrl?.toLowerCase().endsWith(".gif");
  const hasMultipleFrames = imageUrl && videoUrl && imageUrl !== videoUrl && !isGif;
  const playAnimation = animate || isHovered;

  // Efeito para alternar imagens e simular animação/GIF
  useEffect(() => {
    if (!playAnimation || !hasMultipleFrames) {
      setCurrentFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev === 0 ? 1 : 0));
    }, 800); // Alterna a cada 800ms para simular o movimento do exercício

    return () => clearInterval(interval);
  }, [playAnimation, hasMultipleFrames]);

  // Escolhe a URL de origem da imagem/GIF
  let sourceUrl = imageUrl || videoUrl;
  if (playAnimation) {
    if (isGif) {
      sourceUrl = videoUrl;
    } else if (hasMultipleFrames) {
      sourceUrl = currentFrame === 0 ? imageUrl : videoUrl;
    }
  }

  if (!sourceUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#0A0A0B] rounded-2xl ${className}`}>
        <Dumbbell className="w-12 h-12 text-[#16161A]" />
      </div>
    );
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-[#0A0A0B] flex items-center justify-center ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={sourceUrl}
          src={sourceUrl}
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.85 }}
          transition={{ duration: 0.2 }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
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
