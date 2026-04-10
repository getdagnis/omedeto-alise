import React, { useState, useCallback, useRef } from 'react';
import './FloatingText.sass';

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

export function FloatingTextContainer({ items, className = '' }: { items: FloatingItem[], className?: string }) {
  return (
    <div className={`floating-text-container ${className}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="floating-text-item"
          style={{
            left: item.x !== undefined ? `${item.x}px` : '50%',
            top: item.y !== undefined ? `${item.y}px` : '50%',
            color: item.color || 'inherit',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
