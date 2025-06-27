import React, { useEffect, useRef } from 'react';

export interface ContextMenuAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ visible, x, y, actions, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        background: '#23262f',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: 6,
        boxShadow: '0 2px 12px #0008',
        zIndex: 1000,
        minWidth: 160,
        padding: '0.25rem 0',
      }}
    >
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => {
            if (!action.disabled) action.onClick();
            onClose();
          }}
          disabled={action.disabled}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            color: action.disabled ? '#888' : '#fff',
            textAlign: 'left',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: action.disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu; 