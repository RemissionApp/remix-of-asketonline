
import React, { useEffect, useState } from 'react';

interface TypingProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onStart?: () => void;
  runOnce?: boolean;
}

export const TypingEffect: React.FC<TypingProps> = ({ 
  text, 
  speed = 30, 
  className = "", 
  onComplete,
  onStart,
  runOnce = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  
  useEffect(() => {
    // Skip if text is empty
    if (!text) return;
    
    // If runOnce is true and we've already run the animation,
    // just set the full text without animation
    if (runOnce && hasRun) {
      setDisplayedText(text);
      return;
    }
    
    // Reset and start typing
    setIsTyping(true);
    setDisplayedText('');
    
    if (onStart) onStart();
    
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setHasRun(true);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(typingInterval);
  }, [text, speed, onComplete, onStart, runOnce, hasRun]);
  
  return (
    <div className={className}>
      {displayedText}
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};
