import { useState, useCallback, useRef } from 'react';
import React from 'react';

export type FloatingItem = {
  id: string;
  text: string | React.ReactNode;
  x?: number;
  y?: number;
  color?: string;
};

export function useFloatingText() {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const idCounter = useRef(0);

  const addText = useCallback((text: string | React.ReactNode, x?: number, y?: number, color?: string) => {
    const id = `float-${Date.now()}-${idCounter.current++}`;
    setItems((prev) => [...prev, { id, text, x, y, color }]);
    
    // Auto-remove after animation duration (1.2s)
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  }, []);

  return { items, addText };
}
