import React from 'react';
import { Button } from './Button';
import './Notice.sass';

export interface NoticeProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onExplain?: () => void;
  okLabel?: string;
  explainLabel?: string;
}

export function Notice({
  title,
  message,
  isOpen,
  onClose,
  onExplain,
  okLabel = 'OK',
  explainLabel = 'LEARN MORE',
}: NoticeProps) {
  if (!isOpen) return null;

  return (
    <div className="app-Notice-Overlay">
      <div className="app-Notice" role="alertdialog" aria-modal="true">
        {title && <h3 className="app-Notice-Title">{title}</h3>}
        <p className="app-Notice-Message">{message}</p>
        <div className="app-Notice-Actions">
          <Button variant="primary" size="sm" onPress={onClose}>
            {okLabel}
          </Button>
          {onExplain && (
            <Button variant="secondary" size="sm" onPress={onExplain}>
              {explainLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
