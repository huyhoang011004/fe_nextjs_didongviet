import { useState, useEffect, useRef } from 'react';

export function useHeaderScroll(threshold = 80, onHideCallback?: () => void) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const callbackRef = useRef(onHideCallback);

  useEffect(() => {
    callbackRef.current = onHideCallback;
  }, [onHideCallback]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setIsHeaderVisible(false);
        if (callbackRef.current) {
          callbackRef.current();
        }
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, threshold]);

  return { isHeaderVisible };
}
