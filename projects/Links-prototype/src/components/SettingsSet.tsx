import React, { useState, useRef, useEffect } from 'react';
import type { SettingsSet } from '../types';

interface SettingsSetProps {
  settingsSet: SettingsSet;
  selected?: boolean;
  onRename?: (newName: string) => void;
  isDragging?: boolean;
}

const SettingsSetComponent: React.FC<SettingsSetProps> = ({ settingsSet, selected = false, onRename, isDragging = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(settingsSet.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(settingsSet.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== settingsSet.name) {
      onRename?.(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(settingsSet.name);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const getTag = () => {
    if (settingsSet.isRefMod) {
      return 'Ref - Mod';
    } else if (settingsSet.isRef) {
      return 'Ref';
    }
    return null;
  };

  const tag = getTag();

  return (
    <div className={`settings-set ${selected ? 'selected' : ''} ${isDragging ? 'is-dragging' : ''}`} onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            background: 'transparent',
            border: '1px solid #646cff',
            borderRadius: '3px',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            padding: '2px 4px',
            outline: 'none',
            flex: 1,
          }}
        />
      ) : (
        <span className="settings-set-name">{settingsSet.name}</span>
      )}
      
      {tag && (
        <span className={`tag ${tag === 'Ref - Mod' ? 'ref-mod' : 'ref'}`}>
          {tag}
        </span>
      )}
    </div>
  );
};

export default SettingsSetComponent; 