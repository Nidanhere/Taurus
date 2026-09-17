import { useRef, useState, useCallback, useEffect, forwardRef } from 'react';

// Custom hook for draggable elements
function useDraggable() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const lastTimestamp = useRef(0);
  const elementRef = useRef(null);
  const elementBounds = useRef({ width: 0, height: 0 });
  const originalPosition = useRef({ x: 0, y: 0 });
  const returnTimeoutRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });

  // Update position ref when position changes
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Update element bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        elementBounds.current = { width: rect.width, height: rect.height };
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Cleanup animation frame and timeout on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsDropping(false);
    
    // Store current position as original when starting to drag
    originalPosition.current = positionRef.current;
    
    // Clear any pending return timeout
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
      returnTimeoutRef.current = null;
    }
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    lastTimestamp.current = performance.now();
    
    if (elementRef.current) {
      elementRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    const currentTimestamp = performance.now();
    const deltaTime = currentTimestamp - lastTimestamp.current;
    
    if (deltaTime > 0) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      // Calculate velocity for inertia
      velocity.current = {
        x: deltaX / deltaTime,
        y: deltaY / deltaTime
      };
      
      // Calculate new position with boundary constraints
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const { width: elemWidth, height: elemHeight } = elementBounds.current;
      
      const maxOffsetX = (viewportWidth - elemWidth) / 2;
      const maxOffsetY = (viewportHeight - elemHeight) / 2;
      
      setPosition(prev => {
        const newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, prev.x + deltaX));
        const newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, prev.y + deltaY));
        return { x: newX, y: newY };
      });
      
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      lastTimestamp.current = currentTimestamp;
    }
  }, [isDragging]);

  const handlePointerUp = useCallback((e) => {
    if (elementRef.current) {
      elementRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setIsDropping(true);
    
    // Apply inertial movement with boundary constraints
    const applyInertia = () => {
      const friction = 0.95;
      const threshold = 0.1;
      
      if (Math.abs(velocity.current.x) > threshold || Math.abs(velocity.current.y) > threshold) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const { width: elemWidth, height: elemHeight } = elementBounds.current;
        
        const maxOffsetX = (viewportWidth - elemWidth) / 2;
        const maxOffsetY = (viewportHeight - elemHeight) / 2;
        
        setPosition(prev => {
          const newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, prev.x + velocity.current.x * 16));
          const newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, prev.y + velocity.current.y * 16));
          return { x: newX, y: newY };
        });
        
        velocity.current = {
          x: velocity.current.x * friction,
          y: velocity.current.y * friction
        };
        
        animationFrameRef.current = requestAnimationFrame(applyInertia);
      } else {
        velocity.current = { x: 0, y: 0 };
        
        // After inertia stops, trigger return animation
        returnTimeoutRef.current = setTimeout(() => {
          setIsDropping(false);
          // Smooth return to original position
          const animateReturn = () => {
            setPosition(prev => {
              const newX = prev.x + (originalPosition.current.x - prev.x) * 0.1;
              const newY = prev.y + (originalPosition.current.y - prev.y) * 0.1;
              
              if (Math.abs(newX - originalPosition.current.x) < 0.5 && Math.abs(newY - originalPosition.current.y) < 0.5) {
                return originalPosition.current;
              }
              
              animationFrameRef.current = requestAnimationFrame(animateReturn);
              return { x: newX, y: newY };
            });
          };
          animateReturn();
        }, 3000);
      }
    };
    
    applyInertia();
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return {
    elementRef,
    position,
    isDragging,
    isHovering,
    isDropping,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerEnter,
    handlePointerLeave
  };
}

// Draggable word component
function DraggableWord({ word, className }) {
  const {
    elementRef,
    position,
    isDragging,
    isHovering,
    isDropping,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerEnter,
    handlePointerLeave
  } = useDraggable();

  return (
    <span
      ref={elementRef}
      className={`inline-block ${className} ${isDropping ? 'animate-drop-pulse' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : (isHovering ? 'grab' : 'default'),
        userSelect: isDragging ? 'none' : 'auto',
        touchAction: isDragging ? 'none' : 'auto',
        transition: isDropping ? 'transform 0.3s ease-out, filter 0.3s ease-out' : 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {word}
    </span>
  );
}

const HeroContentInternal = ({ headlineRef: externalHeadlineRef, taglineRef: externalTaglineRef }, ref) => {
  const headingWords = ['Best', 'Forex', 'Trading', 'Institute', 'in', 'Kerala'];
  const headlineContainerRef = useRef(null);

  // Forward the ref to the headline container
  useEffect(() => {
    if (externalHeadlineRef) {
      if (typeof externalHeadlineRef === 'function') {
        externalHeadlineRef(headlineContainerRef.current);
      } else {
        externalHeadlineRef.current = headlineContainerRef.current;
      }
    }
  }, [externalHeadlineRef]);

  // Subheading draggable
  const {
    elementRef: subheadingRef,
    position: subheadingPosition,
    isDragging: subheadingDragging,
    isHovering: subheadingHovering,
    isDropping: subheadingDropping,
    handlePointerDown: subheadingDown,
    handlePointerMove: subheadingMove,
    handlePointerUp: subheadingUp,
    handlePointerEnter: subheadingEnter,
    handlePointerLeave: subheadingLeave
  } = useDraggable();

  // Forward external tagline ref
  useEffect(() => {
    if (externalTaglineRef) {
      if (typeof externalTaglineRef === 'function') {
        externalTaglineRef(subheadingRef.current);
      } else {
        externalTaglineRef.current = subheadingRef.current;
      }
    }
  }, [externalTaglineRef, subheadingRef]);

  return (
    <div className="relative z-10 flex flex-col items-center text-center pointer-events-auto px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Prominent main headline with independently draggable words */}
      <h1
        ref={headlineContainerRef}
        className="font-editorial text-[1.85rem] sm:text-[2.6rem] md:text-[3.5rem] lg:text-[4.2rem] xl:text-[4.8rem] font-bold leading-[1.12] tracking-[0.04em] text-[#f4efe4] uppercase max-w-5xl"
      >
        {headingWords.map((word, index) => (
          <DraggableWord
            key={index}
            word={word}
            className="mx-1 sm:mx-2"
          />
        ))}
      </h1>

      {/* Sub-line motto as single draggable unit */}
      <p
        ref={subheadingRef}
        className={`mt-4 sm:mt-6 font-editorial text-sm sm:text-base md:text-lg tracking-[0.15em] text-[#c9b79c] uppercase font-medium max-w-3xl ${subheadingDropping ? 'animate-drop-pulse' : ''}`}
        style={{
          transform: `translate(${subheadingPosition.x}px, ${subheadingPosition.y}px)`,
          cursor: subheadingDragging ? 'grabbing' : (subheadingHovering ? 'grab' : 'default'),
          userSelect: subheadingDragging ? 'none' : 'auto',
          touchAction: subheadingDragging ? 'none' : 'auto',
          transition: subheadingDropping ? 'transform 0.3s ease-out, filter 0.3s ease-out' : 'none'
        }}
        onPointerDown={subheadingDown}
        onPointerMove={subheadingMove}
        onPointerUp={subheadingUp}
        onPointerEnter={subheadingEnter}
        onPointerLeave={subheadingLeave}
      >
        Learn, Trade, Excel with the best forex trading institute in Calicut.
      </p>
    </div>
  );
};

export const HeroContent = forwardRef(HeroContentInternal);
