import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ word }) => {
  const [visibleLetters, setVisibleLetters] = useState('');

  useEffect(() => {
    let interval;
    if (word) {
      interval = setInterval(() => {
        setVisibleLetters(prev => {
          const nextLetter = word[prev.length];
          if (nextLetter === undefined) {
            clearInterval(interval);
          }
          return prev + nextLetter;
        });
      }, 200); // Adjust the interval as needed
    }

    return () => clearInterval(interval);
  }, [word]);

  return (
    <div className="inline-block">
      {visibleLetters}
      <span className="animate-blink">_</span>
    </div>
  );
};

export default TypingAnimation;
