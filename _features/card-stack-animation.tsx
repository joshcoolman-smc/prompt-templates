import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Zap, Send, Music } from 'lucide-react';

const CardStackComponent = () => {
  // Card data with colors and icons
  const cards = [
    { id: 0, color: "#ff6b6b", icon: Heart },
    { id: 1, color: "#4ecdc4", icon: Star },
    { id: 2, color: "#45b7d1", icon: Zap },
    { id: 3, color: "#eeb868", icon: Send },
    { id: 4, color: "#e56399", icon: Music }
  ];
  
  // Animation states
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatingCards, setAnimatingCards] = useState([]);
  const [clickQueue, setClickQueue] = useState(0);
  
  // Get a darker shade of the color for the icon
  const getDarkerShade = (hexColor) => {
    // Remove the # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);
    
    // Darken by multiplying by 0.7
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Get a consistent rotation for a card
  const getRotation = (index) => ((index * 7919) % 7) - 3.5; // Between -3.5 and 3.5 degrees
  
  // Handle card click - now supports rapid clicks with staggered animations
  const handleCardClick = () => {
    // Add to click queue - this counts how many animations we need to perform
    setClickQueue(prev => prev + 1);
  };
  
  // Process the click queue and create staggered animations
  useEffect(() => {
    if (clickQueue <= 0) return;
    
    // Start a new card animation if we have clicks in the queue
    const currentIndex = activeIndex;
    const animationId = Date.now(); // Unique ID for this animation
    
    // Add this card to the animating cards array
    setAnimatingCards(prev => [...prev, {
      id: animationId,
      cardIndex: currentIndex,
      phase: 'exit' // start with exit phase
    }]);
    
    // Decrement the queue
    setClickQueue(prev => prev - 1);
    
    // Update the active index for the next animation
    setActiveIndex((prev) => (prev + 1) % cards.length);
    
  }, [clickQueue, activeIndex, cards.length]);
  
  // Calculate what cards should be displayed in the stack
  const visibleStackIndices = [];
  let index = activeIndex;
  for (let i = 0; i < cards.length; i++) {
    // Skip indices that are currently animating
    if (!animatingCards.some(a => a.cardIndex === index && a.phase === 'exit')) {
      visibleStackIndices.push(index);
    }
    index = (index + 1) % cards.length;
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative h-96 w-64">
        {/* Static stack cards */}
        {visibleStackIndices.slice(1).map((cardIndex, stackPosition) => {
          const card = cards[cardIndex];
          return (
            <motion.div
              key={`stack-${cardIndex}`}
              className="absolute w-full h-full rounded-xl shadow-md flex items-center justify-center"
              style={{
                backgroundColor: card.color,
                zIndex: 10 - stackPosition - 1,
                transformOrigin: "center"
              }}
              initial={{
                y: 8 + (stackPosition * 7),
                rotate: getRotation(cardIndex),
              }}
              animate={{
                y: 8 + (stackPosition * 7),
                rotate: getRotation(cardIndex),
              }}
            >
              {React.createElement(card.icon, { 
                size: 96, 
                color: getDarkerShade(card.color),
                strokeWidth: 1.5
              })}
            </motion.div>
          );
        })}
        
        {/* Top card - only show if it's not animating out */}
        {visibleStackIndices.length > 0 && (
          <motion.div
            className="absolute w-full h-full rounded-xl shadow-md flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: cards[visibleStackIndices[0]].color,
              zIndex: 20,
              transformOrigin: "center"
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: getRotation(visibleStackIndices[0]),
            }}
            animate={{
              x: 0,
              y: 0,
              rotate: getRotation(visibleStackIndices[0]),
            }}
            onClick={handleCardClick}
          >
            {React.createElement(cards[visibleStackIndices[0]].icon, { 
              size: 96, 
              color: getDarkerShade(cards[visibleStackIndices[0]].color),
              strokeWidth: 1.5
            })}
          </motion.div>
        )}
        
        {/* Animating cards - Exit Phase */}
        {animatingCards
          .filter(anim => anim.phase === 'exit')
          .map(anim => {
            const card = cards[anim.cardIndex];
            
            // Exit animation (slide right)
            setTimeout(() => {
              setAnimatingCards(prev => 
                prev.map(a => a.id === anim.id ? {...a, phase: 'return'} : a)
              );
            }, 300); // Time before changing to return phase
            
            return (
              <motion.div
                key={`anim-exit-${anim.id}`}
                className="absolute w-full h-full rounded-xl shadow-md flex items-center justify-center"
                style={{
                  backgroundColor: card.color,
                  zIndex: 25, // Highest z-index to stay above everything
                  transformOrigin: "center"
                }}
                initial={{
                  x: 0,
                  y: 0,
                  rotate: getRotation(anim.cardIndex),
                }}
                animate={{
                  x: 300,
                  rotate: getRotation(anim.cardIndex) + 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  duration: 0.3
                }}
              >
                {React.createElement(card.icon, { 
                  size: 96, 
                  color: getDarkerShade(card.color),
                  strokeWidth: 1.5
                })}
              </motion.div>
            );
          })}
          
        {/* Animating cards - Return Phase */}
        {animatingCards
          .filter(anim => anim.phase === 'return')
          .map(anim => {
            const card = cards[anim.cardIndex];
            
            // Return animation (slide to back of stack)
            // After animation completes, remove from animating cards
            setTimeout(() => {
              setAnimatingCards(prev => prev.filter(a => a.id !== anim.id));
            }, 400);
            
            return (
              <motion.div
                key={`anim-return-${anim.id}`}
                className="absolute w-full h-full rounded-xl shadow-md flex items-center justify-center"
                style={{
                  backgroundColor: card.color,
                  zIndex: 1, // Below the stack
                  transformOrigin: "center"
                }}
                initial={{
                  x: 270,
                  y: 0,
                  rotate: getRotation(anim.cardIndex) + 5,
                }}
                animate={{
                  x: 0,
                  y: 8 + ((cards.length - 2) * 7),
                  rotate: getRotation(anim.cardIndex),
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 22,
                  duration: 0.4,
                  ease: "easeOut"
                }}
              >
                {React.createElement(card.icon, { 
                  size: 96, 
                  color: getDarkerShade(card.color),
                  strokeWidth: 1.5
                })}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default CardStackComponent;