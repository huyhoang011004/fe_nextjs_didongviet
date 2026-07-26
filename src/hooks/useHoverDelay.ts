import { useState, useRef, useEffect, useCallback } from 'react';

export function useHoverDelay(enterDelay = 0, leaveDelay = 500) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (enterDelay > 0) {
      timeoutRef.current = setTimeout(() => setIsOpen(true), enterDelay);
    } else {
      setIsOpen(true);
    }
  }, [enterDelay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, leaveDelay);
  }, [leaveDelay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave };
}
