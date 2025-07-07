import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface SwipeGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const SwipeGestureHandler: React.FC<SwipeGestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const navigate = useNavigate();
  const { setActiveScreen } = useAppStore();

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    const minSwipeDistance = 50;
    const maxVerticalDeviation = 100;

    // Horizontal swipes
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDeviation) {
      if (deltaX > 0) {
        // Swipe right - go back to main
        if (onSwipeRight) {
          onSwipeRight();
        } else {
          setActiveScreen('main');
          navigate('/main');
        }
      } else {
        // Swipe left
        if (onSwipeLeft) {
          onSwipeLeft();
        }
      }
    }
    
    // Vertical swipes
    if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaX) < maxVerticalDeviation) {
      if (deltaY > 0) {
        // Swipe down
        if (onSwipeDown) {
          onSwipeDown();
        }
      } else {
        // Swipe up
        if (onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full"
    >
      {children}
    </div>
  );
};