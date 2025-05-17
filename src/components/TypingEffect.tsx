
import React, { useEffect, useState } from 'react';

interface TypingProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingEffect: React.FC<TypingProps> = ({ 
  text, 
  speed = 30, 
  className = "", 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  
  useEffect(() => {
    if (!text || hasRun || text.length === 0) return;
    
    // Instead of typing character by character, display the full text immediately
    setDisplayedText(text);
    setIsTyping(false);
    setHasRun(true);
    
    // Call onComplete callback if provided
    if (onComplete) onComplete();
    
    return () => {};
  }, [text, speed, onComplete, hasRun]);
  
  return (
    <div className={className}>
      {displayedText}
    </div>
  );
};
