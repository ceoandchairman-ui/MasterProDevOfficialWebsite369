import React, { useState, useEffect } from 'react';

export default function FlatteryMessage({ 
  message, 
  isVisible, 
  hasAnimated, 
  containerColor = '#e3f2fd', 
  emojiPosition = 'left',
  emojiType = 'female'
}) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Diverse emoji selection
  const emojis = {
    female: ['👩', '👩‍🦱', '👩‍🦰', '👩‍🦳', '🧑‍🦱', '🧑‍🦰'],
    male: ['👨', '👨‍🦱', '👨‍🦰', '👨‍🦳', '🧑', '🧑‍🦲'],
    neutral: ['🧑', '🧑‍🦱', '🧑‍🦰', '🧑‍🦳', '🧑‍🦲']
  };

  // Select a random emoji from the specified type
  const selectedEmoji = emojis[emojiType] 
    ? emojis[emojiType][Math.floor(Math.random() * emojis[emojiType].length)]
    : emojis.neutral[Math.floor(Math.random() * emojis.neutral.length)];

  useEffect(() => {
    if (message && isVisible) {
      // Only animate if this is the first time showing and hasn't animated before
      if (!hasAnimated) {
        setShouldAnimate(true);
      }
    }
  }, [message, isVisible, hasAnimated]);

  // Don't render anything if no message or not visible
  if (!message || !isVisible) {
    return <div className="flattery-message-container" style={{ visibility: 'hidden' }}><div className="flattery-message-wrapper">&nbsp;</div></div>;
  }

  return (
    <div className="flattery-message-container">
      <div 
        className={`flattery-message-wrapper ${shouldAnimate ? 'animate-in' : 'static'}`}
        style={{ 
          backgroundColor: containerColor,
          '--start-x': `${(Math.random() - 0.5) * 400}px`,
          '--start-y': `${(Math.random() - 0.5) * 200}px`,
          '--start-rotation': `${(Math.random() - 0.5) * 60}deg`,
          '--start-scale': `${0.4 + Math.random() * 0.3}`
        }}
      >
        <div className={`content-layout ${emojiPosition === 'right' ? 'emoji-right' : 'emoji-left'}`}>
          <div className="emoji-container">
            <span className="persona-emoji">{selectedEmoji}</span>
          </div>
          <div className="message-bubble">
            {message}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flattery-message-container {
          display: flex;
          justify-content: center;
          padding: 2rem 1rem;
          background-color: #f9fafb;
          pointer-events: auto;
        }

        .flattery-message-wrapper {
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(229, 231, 235, 0.3);
          max-width: 90vw;
          width: 100%;
          max-width: 600px;
        }

        .flattery-message-wrapper.animate-in {
          opacity: 0;
          animation: vectorFetch 1.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
          animation-delay: 200ms;
        }

        .flattery-message-wrapper.static {
          opacity: 1;
        }

        .content-layout {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .content-layout.emoji-right {
          flex-direction: row-reverse;
        }

        .content-layout.emoji-left {
          flex-direction: row;
        }

        .emoji-container {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .persona-emoji {
          font-size: 2.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .message-bubble {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.25rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #1a202c;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          position: relative;
        }

        /* Speech bubble tail */
        .emoji-left .message-bubble::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid rgba(255, 255, 255, 0.95);
        }

        .emoji-right .message-bubble::before {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid rgba(255, 255, 255, 0.95);
        }

        @media (max-width: 768px) {
          .flattery-message-wrapper {
            padding: 1rem;
            border-radius: 1rem;
          }
          
          .content-layout {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
          
          .content-layout.emoji-right,
          .content-layout.emoji-left {
            flex-direction: column;
          }
          
          .persona-emoji {
            font-size: 2rem;
          }
          
          .message-bubble {
            font-size: 0.9rem;
            padding: 0.875rem 1.25rem;
          }

          /* Hide speech bubble tails on mobile */
          .message-bubble::before {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .flattery-message-container {
            padding: 1.5rem 0.75rem;
          }
          
          .persona-emoji {
            font-size: 1.75rem;
          }
          
          .message-bubble {
            font-size: 0.85rem;
            padding: 0.75rem 1rem;
          }
        }

        @keyframes vectorFetch {
          0% {
            transform: translate(var(--start-x), var(--start-y)) rotate(var(--start-rotation)) scale(var(--start-scale));
            opacity: 0;
            filter: blur(3px);
          }
          60% {
            transform: translate(0, 0) rotate(0deg) scale(1.05);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}