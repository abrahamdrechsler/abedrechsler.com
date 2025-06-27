import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { Group as GroupType, SettingsSet } from '../types';
import SettingsSetComponent from './SettingsSet';

interface GroupProps {
  group: GroupType;
  children: SettingsSet[];
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  onChildSelect?: (childId: string, e: React.MouseEvent) => void;
  selectedChildIds?: string[];
  onRename?: (newName: string) => void;
  onChildRename?: (childId: string, newName: string) => void;
  onChildContextMenu?: (childId: string, e: React.MouseEvent) => void;
}

const Group: React.FC<GroupProps> = ({
  group,
  children,
  isSelected = false,
  onSelect,
  onChildSelect,
  selectedChildIds = [],
  onRename,
  onChildRename,
  onChildContextMenu
}) => {
  const [isExpanded, setIsExpanded] = useState(group.expanded ?? true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(group.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Safety check
  if (!group) {
    return null;
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleGroupClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onSelect?.(e);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(group.name);
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
    if (trimmedValue && trimmedValue !== group.name) {
      onRename?.(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(group.name);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const getTag = () => {
    // Groups don't have ref tags in current design
    return null;
  };

  const tag = getTag();

  return (
    <div className="group">
      <div 
        className={`group-header ${isSelected ? 'selected' : ''}`}
        onClick={handleGroupClick}
        onDoubleClick={handleDoubleClick}
      >
        <button 
          className="expand-button"
          onClick={handleToggle}
          aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
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
          <span className="group-name">{group.name}</span>
        )}
        
        {tag && (
          <span className={`tag ${tag === 'Ref - Mod' ? 'ref-mod' : 'ref'}`}>
            {tag}
          </span>
        )}
      </div>
      
      {isExpanded && (
        <div className="group-children">
          {children.length === 0 ? (
            <div style={{
              padding: '8px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Empty group
            </div>
          ) : (
            children.map((child) => (
              <div
                key={child.id}
                className="group-child"
                onClick={e => {
                  e.stopPropagation(); // Prevent bubbling to group header
                  onChildSelect?.(child.id, e);
                }}
                onContextMenu={e => {
                  e.stopPropagation(); // Prevent bubbling to group header
                  onChildContextMenu?.(child.id, e);
                }}
              >
                <SettingsSetComponent
                  settingsSet={child}
                  selected={selectedChildIds.includes(child.id)}
                  onRename={(newName) => onChildRename?.(child.id, newName)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Group; 