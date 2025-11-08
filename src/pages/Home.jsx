import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import ServicesSection from '../components/home/ServicesSection';
import ConsultantsSection from '../components/home/ConsultantsSection';
import ReviewsSection from '../components/home/ReviewsSection';
import PostYourRatingSection from '../components/home/PostYourRatingSection';
import ContactSection from '../components/home/ContactSection';
import WaveSeparator from '../components/shared/WaveSeparator';
import UserIntentDialog from '../components/shared/UserIntentDialog';
import FlatteryMessage from '../components/shared/FlatteryMessage';

const flatteryMessages = {
  career: {
    '#about': "Exploring your potential. That's the first step of a true innovator.",
    '#services': "Diving into solutions? A very strategic move for your career path.",
    '#consultants': "Connecting with experts. A smart move to accelerate your growth.",
    '#reviews': "Witnessing success stories. You're visualizing your own bright future.",
    '#post-rating': "Your voice matters ⭐ — share your career journey insights with us!",
    '#contact': "You've reached the final step. Your dedication is remarkable.",
  },
  business: {
    '#about': "Understanding the mission. A solid foundation for any successful venture.",
    '#services': "Analyzing our services shows remarkable insight for scaling your business.",
    '#consultants': "You're assessing the talent. That's a key leadership trait.",
    '#reviews': "Reviewing past results is a wise strategy for future partnerships.",
    '#post-rating': "Your voice matters ⭐ — help other businesses by sharing your experience!",
    '#contact': "Ready to take action. Your decisiveness will drive your business to new heights.",
  },
  other: {
    '#about': "Curiosity is the engine of achievement. You're on a great path!",
    '#services': "It's smart to see what's possible. Great ideas start with exploration.",
    '#consultants': "You have a keen eye for talent and expertise!",
    '#reviews': "It's always insightful to learn from the experiences of others.",
    '#post-rating': "Your voice matters ⭐ — share it with us!",
    '#contact': "You've explored everything! Your thoroughness is impressive.",
  }
};

const sectionConfig = {
  '#about': { 
    containerColor: '#e8f5e8',
    emojiPosition: 'left',
    emojiType: 'female'
  },
  '#services': { 
    containerColor: '#e3f2fd',
    emojiPosition: 'right',
    emojiType: 'male'
  },
  '#consultants': { 
    containerColor: '#fff8e1',
    emojiPosition: 'left',
    emojiType: 'neutral'
  },
  '#reviews': { 
    containerColor: '#fce4ec',
    emojiPosition: 'right',
    emojiType: 'female'
  },
  '#post-rating': {
    containerColor: '#DCFCE7',
    emojiPosition: 'right',
    emojiType: 'female'
  },
  '#contact': { 
    containerColor: '#f3e5f5',
    emojiPosition: 'left',
    emojiType: 'male'
  }
};

const brandColors = ['#ffb400', '#5271ff', '#00bf63'];

const generateAllPermutations = (colors) => {
  const [a, b, c] = colors;
  return [
    [a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]
  ];
};

const shuffle = (array) => {
  const shuffled = [...array];
  let currentIndex = shuffled.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex],
    ];
  }
  return shuffled;
};

export default function Home() {
  const [isIntentDialogOpen, setIntentDialogOpen] = useState(false);
  const [userIntent, setUserIntent] = useState(null);
  const [waveMessageStates, setWaveMessageStates] = useState({});
  const waveRefs = useRef({});

  const wavePermutations = useMemo(() => {
    const allPermutations = generateAllPermutations(brandColors);
    const shuffledPermutations = shuffle(allPermutations);
    return shuffledPermutations.slice(0, 6); 
  }, []);

  useEffect(() => {
    const savedIntent = localStorage.getItem('userIntent');
    
    if (savedIntent) {
      setUserIntent(savedIntent);
      setIntentDialogOpen(false);
    } else {
      setTimeout(() => setIntentDialogOpen(true), 1500);
    }
  }, []);

  const handleIntentSelect = (intent) => {
    setUserIntent(intent);
    setIntentDialogOpen(false);
  };
  
  const displayFlatteryMessage = useCallback((sectionId) => {
    if (!userIntent) return;
    
    setWaveMessageStates(prev => ({
      ...prev,
      [sectionId]: {
        isVisible: true,
        hasAnimated: prev[sectionId]?.hasAnimated || false
      }
    }));
  }, [userIntent]);

  useEffect(() => {
    if (!userIntent) return;

    const observers = [];

    Object.keys(waveRefs.current).forEach(sectionId => {
      const waveElement = waveRefs.current[sectionId];
      
      if (waveElement) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              displayFlatteryMessage(sectionId);
            }
          },
          { 
            rootMargin: '0px 0px -90% 0px'
          }
        );
        observer.observe(waveElement);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [userIntent, displayFlatteryMessage]);
  
  return (
    <div className="overflow-x-hidden">
      <UserIntentDialog open={isIntentDialogOpen} onIntentSelect={handleIntentSelect} />

      <Hero />
      
      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#about']} 
        isVisible={waveMessageStates['#about']?.isVisible || false}
        hasAnimated={waveMessageStates['#about']?.hasAnimated || false}
        containerColor={sectionConfig['#about'].containerColor}
        emojiPosition={sectionConfig['#about'].emojiPosition}
        emojiType={sectionConfig['#about'].emojiType}
      />
      <div ref={el => waveRefs.current['#about'] = el}>
        <WaveSeparator colors={wavePermutations[0]} />
      </div>
      <AboutSection />
      
      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#services']} 
        isVisible={waveMessageStates['#services']?.isVisible || false}
        hasAnimated={waveMessageStates['#services']?.hasAnimated || false}
        containerColor={sectionConfig['#services'].containerColor}
        emojiPosition={sectionConfig['#services'].emojiPosition}
        emojiType={sectionConfig['#services'].emojiType}
      />
      <div ref={el => waveRefs.current['#services'] = el}>
        <WaveSeparator colors={wavePermutations[1]} />
      </div>
      <ServicesSection />
      
      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#consultants']} 
        isVisible={waveMessageStates['#consultants']?.isVisible || false}
        hasAnimated={waveMessageStates['#consultants']?.hasAnimated || false}
        containerColor={sectionConfig['#consultants'].containerColor}
        emojiPosition={sectionConfig['#consultants'].emojiPosition}
        emojiType={sectionConfig['#consultants'].emojiType}
      />
      <div ref={el => waveRefs.current['#consultants'] = el}>
        <WaveSeparator colors={wavePermutations[2]} />
      </div>
      <ConsultantsSection />
      
      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#reviews']} 
        isVisible={waveMessageStates['#reviews']?.isVisible || false}
        hasAnimated={waveMessageStates['#reviews']?.hasAnimated || false}
        containerColor={sectionConfig['#reviews'].containerColor}
        emojiPosition={sectionConfig['#reviews'].emojiPosition}
        emojiType={sectionConfig['#reviews'].emojiType}
      />
      <div ref={el => waveRefs.current['#reviews'] = el}>
        <WaveSeparator colors={wavePermutations[3]} />
      </div>
      <ReviewsSection />

      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#post-rating']} 
        isVisible={waveMessageStates['#post-rating']?.isVisible || false}
        hasAnimated={waveMessageStates['#post-rating']?.hasAnimated || false}
        containerColor={sectionConfig['#post-rating'].containerColor}
        emojiPosition={sectionConfig['#post-rating'].emojiPosition}
        emojiType={sectionConfig['#post-rating'].emojiType}
      />
      <div ref={el => waveRefs.current['#post-rating'] = el}>
        <WaveSeparator colors={wavePermutations[4]} />
      </div>
      <PostYourRatingSection />
      
      <FlatteryMessage 
        message={flatteryMessages[userIntent]?.['#contact']} 
        isVisible={waveMessageStates['#contact']?.isVisible || false}
        hasAnimated={waveMessageStates['#contact']?.hasAnimated || false}
        containerColor={sectionConfig['#contact'].containerColor}
        emojiPosition={sectionConfig['#contact'].emojiPosition}
        emojiType={sectionConfig['#contact'].emojiType}
      />
      <div ref={el => waveRefs.current['#contact'] = el}>
        <WaveSeparator colors={wavePermutations[5]} />
      </div>
      <ContactSection />
    </div>
  );
}