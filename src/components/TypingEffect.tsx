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
  className = '',
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!text || hasRun) return;

    setIsTyping(true);
    setDisplayedText('');
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
  }, [text, speed, onComplete, hasRun]);

  return (
    <div className={className}>
      {displayedText}
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};
