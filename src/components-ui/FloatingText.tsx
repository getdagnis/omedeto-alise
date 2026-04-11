import React from 'react';
import './FloatingText.sass';
import type { FloatingItem } from '../hooks/useFloatingText';

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
