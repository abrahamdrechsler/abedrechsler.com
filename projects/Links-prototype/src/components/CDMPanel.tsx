import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import SettingsSetComponent from './SettingsSet';
import Group from './Group';
import ContextMenu from './ContextMenu';
import type { ContextMenuAction } from './ContextMenu';
import type { SettingsSet } from '../types';

const CDMPanel: React.FC = () => {
  const settingsSets = useStore(state => state.cdm.settingsSets);
  const groups = useStore(state => state.cdm.groups);
  const visualOrder = useStore(state => state.cdm.visualOrder);
  const adminRules = useStore(state => state.adminRules);
  const addSettingsSet = useStore(state => state.addSettingsSet);
  const deleteItem = useStore(state => state.deleteItem);
  const reorderItems = useStore(state => state.reorderItems);
  const groupItems = useStore(state => state.groupItems);
  const renameSettingsSet = useStore(state => state.renameSettingsSet);
  const renameGroup = useStore(state => state.renameGroup);
  const moveItemToGroup = useStore(state => state.moveItemToGroup);
  const moveItemToRoot = useStore(state => state.moveItemToRoot);
  const reorderWithinGroup = useStore(state => state.reorderWithinGroup);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Refs for stable access to current state in event handlers
  const selectedIdsRef = useRef<string[]>([]);
  const lastSelectedIdRef = useRef<string | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
    lastSelectedIdRef.current = lastSelectedId;
  }, [selectedIds, lastSelectedId]);

  // Context menu state
  const [menu, setMenu] = useState<{ visible: boolean; x: number; y: number; actions: ContextMenuAction[] }>({ visible: false, x: 0, y: 0, actions: [] });

  // Helper to get settings sets by group in the correct order
  const getGroupChildren = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    
    // Return children in the order specified by group.children array
    return group.children.map(childId => 
      settingsSets.find(set => set.id === childId)
    ).filter(Boolean) as SettingsSet[];
  };

  // Root-level settings sets (not in any group)
  const rootSettingsSets = settingsSets.filter(set => !set.groupId);

  // Create unified rendering order using visualOrder from store
  const renderOrder = visualOrder.map(id => {
    const group = groups.find(g => g.id === id);
    if (group) {
      return { type: 'group' as const, item: group };
    }
    const settingsSet = rootSettingsSets.find(s => s.id === id);
    if (settingsSet) {
      return { type: 'settingsSet' as const, item: settingsSet };
    }
    return null;
  }).filter(Boolean) as Array<{ type: 'group' | 'settingsSet', item: any }>;

  // Keyboard navigation and delete logic
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    // Use refs to get current state without dependency issues
    const currentLastSelected = lastSelectedIdRef.current;
    const currentSelectedIds = selectedIdsRef.current;
    
    // Handle Delete key for any selection
    if (e.key === 'Delete' && currentSelectedIds.length > 0) {
      e.preventDefault();
      currentSelectedIds.forEach(id => {
        const isGroup = groups.find(g => g.id === id);
        deleteItem('cdm', id, isGroup ? 'group' : 'settingsSet');
      });
      setSelectedIds([]);
      setLastSelectedId(null);
      return;
    }
    
    // Arrow key navigation only works with single selection and when reordering is allowed
    if (!currentLastSelected || currentSelectedIds.length !== 1 || !adminRules.allowReorder) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      const settingsSet = settingsSets.find(s => s.id === currentLastSelected);
      const group = groups.find(g => g.id === currentLastSelected);
      
      if (settingsSet && settingsSet.groupId) {
        // Item is a settings set within a group
        const parentGroup = groups.find(g => g.id === settingsSet.groupId);
        if (!parentGroup) return;
        
        const currentIndex = parentGroup.children.indexOf(currentLastSelected);
        if (currentIndex > 0) {
          // Move up within the group
          const newChildren = [...parentGroup.children];
          const temp = newChildren[currentIndex - 1];
          newChildren[currentIndex - 1] = newChildren[currentIndex];
          newChildren[currentIndex] = temp;
          reorderWithinGroup('cdm', settingsSet.groupId, newChildren);
        } else {
          // Exit group and move to root level above the group
          const groupIndex = visualOrder.indexOf(settingsSet.groupId);
          moveItemToRoot('cdm', currentLastSelected, groupIndex);
        }
      } else {
        // Item is at root level (either settings set or group)
        const currentIndex = visualOrder.indexOf(currentLastSelected);
        if (currentIndex > 0) {
          const prevItemId = visualOrder[currentIndex - 1];
          const prevIsGroup = groups.find(g => g.id === prevItemId);
          
          if (prevIsGroup && settingsSet) {
            // Previous item is a group and current item is a settings set - enter the group at the end
            moveItemToGroup('cdm', currentLastSelected, prevItemId, prevIsGroup.children.length);
          } else {
            // Normal root-level swap
            const newOrder = [...visualOrder];
            [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
            reorderItems('cdm', newOrder);
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      const settingsSet = settingsSets.find(s => s.id === currentLastSelected);
      const group = groups.find(g => g.id === currentLastSelected);
      
      if (settingsSet && settingsSet.groupId) {
        // Item is a settings set within a group
        const parentGroup = groups.find(g => g.id === settingsSet.groupId);
        if (!parentGroup) return;
        
        const currentIndex = parentGroup.children.indexOf(currentLastSelected);
        if (currentIndex < parentGroup.children.length - 1) {
          // Move down within the group
          const newChildren = [...parentGroup.children];
          const temp = newChildren[currentIndex + 1];
          newChildren[currentIndex + 1] = newChildren[currentIndex];
          newChildren[currentIndex] = temp;
          reorderWithinGroup('cdm', settingsSet.groupId, newChildren);
        } else {
          // Exit group and move to root level below the group
          const groupIndex = visualOrder.indexOf(settingsSet.groupId);
          moveItemToRoot('cdm', currentLastSelected, groupIndex + 1);
        }
      } else {
        // Item is at root level (either settings set or group)
        const currentIndex = visualOrder.indexOf(currentLastSelected);
        if (currentIndex < visualOrder.length - 1) {
          const nextItemId = visualOrder[currentIndex + 1];
          const nextIsGroup = groups.find(g => g.id === nextItemId);
          
          if (nextIsGroup && settingsSet) {
            // Next item is a group and current item is a settings set - enter the group
            moveItemToGroup('cdm', currentLastSelected, nextItemId, 0);
          } else {
            // Normal root-level swap
            const newOrder = [...visualOrder];
            [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
            reorderItems('cdm', newOrder);
          }
        }
      }
    }
  }, [settingsSets, groups, visualOrder, reorderWithinGroup, moveItemToRoot, reorderItems, moveItemToGroup, deleteItem, setSelectedIds, setLastSelectedId, adminRules]);

  const moveItemUp = (itemId: string) => {
    const item = settingsSets.find(s => s.id === itemId) || groups.find(g => g.id === itemId);
    if (!item) return;

    // If item is in a group
    if ('groupId' in item && item.groupId) {
      const group = groups.find(g => g.id === item.groupId);
      if (!group) return;

      const currentIndex = group.children.indexOf(itemId);
      if (currentIndex > 0) {
        // Move up within the group
        const newChildren = [...group.children];
        [newChildren[currentIndex - 1], newChildren[currentIndex]] = [newChildren[currentIndex], newChildren[currentIndex - 1]];
        reorderWithinGroup('cdm', item.groupId, newChildren);
      } else {
        // Exit group and move to root level above the group
        const groupIndex = visualOrder.indexOf(item.groupId);
        moveItemToRoot('cdm', itemId, groupIndex);
      }
    } else {
      // Item is at root level
      const currentIndex = visualOrder.indexOf(itemId);
      if (currentIndex > 0) {
        const newOrder = [...visualOrder];
        [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
        reorderItems('cdm', newOrder);
      }
    }
  };

  const moveItemDown = (itemId: string) => {
    const item = settingsSets.find(s => s.id === itemId) || groups.find(g => g.id === itemId);
    if (!item) return;

    // If item is in a group
    if ('groupId' in item && item.groupId) {
      const group = groups.find(g => g.id === item.groupId);
      if (!group) return;

      const currentIndex = group.children.indexOf(itemId);
      if (currentIndex < group.children.length - 1) {
        // Move down within the group
        const newChildren = [...group.children];
        [newChildren[currentIndex], newChildren[currentIndex + 1]] = [newChildren[currentIndex + 1], newChildren[currentIndex]];
        reorderWithinGroup('cdm', item.groupId, newChildren);
      } else {
        // Exit group and move to root level below the group
        const groupIndex = visualOrder.indexOf(item.groupId);
        moveItemToRoot('cdm', itemId, groupIndex + 1);
      }
    } else {
      // Item is at root level
      const currentIndex = visualOrder.indexOf(itemId);
      if (currentIndex < visualOrder.length - 1) {
        const nextItemId = visualOrder[currentIndex + 1];
        const nextGroup = groups.find(g => g.id === nextItemId);
        
        if (nextGroup && 'groupId' in item === false) {
          // Next item is a group and current item is a settings set - enter the group
          moveItemToGroup('cdm', itemId, nextItemId, 0);
        } else {
          // Normal root-level swap
          const newOrder = [...visualOrder];
          [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
          reorderItems('cdm', newOrder);
        }
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]); // Only re-add listener if handleKeyDown changes

  // Create flat list of all visible items in visual order (for shift-select)
  const getFlatVisualOrder = () => {
    const flatOrder: string[] = [];
    visualOrder.forEach(id => {
      const group = groups.find(g => g.id === id);
      if (group) {
        flatOrder.push(id); // Add group itself
        if (group.expanded !== false) { // Add children if expanded
          flatOrder.push(...group.children);
        }
      } else {
        flatOrder.push(id); // Add root-level settings set
      }
    });
    return flatOrder;
  };

  // Enhanced selection handlers
  const handleSelect = (id: string, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelectedId) {
      // Shift-click: select range using actual visual order
      const flatOrder = getFlatVisualOrder();
      const startIndex = flatOrder.indexOf(lastSelectedId);
      const endIndex = flatOrder.indexOf(id);
      if (startIndex !== -1 && endIndex !== -1) {
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        const rangeIds = flatOrder.slice(minIndex, maxIndex + 1);
        setSelectedIds(rangeIds);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl-click: toggle individual item
      setSelectedIds(prev => 
        prev.includes(id) 
          ? prev.filter(selectedId => selectedId !== id)
          : [...prev, id]
      );
      setLastSelectedId(id);
    } else {
      // Regular click: select only this item
      setSelectedIds([id]);
      setLastSelectedId(id);
    }
  };

  const handleSelectAll = () => {
    const flatOrder = getFlatVisualOrder();
    setSelectedIds(flatOrder);
    setLastSelectedId(null);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
    setLastSelectedId(null);
  };

  // Canvas click handler to deselect all
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if we clicked on the panel div itself (not on any child elements)
    if (e.target === e.currentTarget) {
      handleDeselectAll();
    }
  };

  // Context menu logic
  const openContextMenu = (e: React.MouseEvent, id: string, type: 'settingsSet' | 'group') => {
    e.preventDefault();



    let currentSelection = selectedIds;
    // If the right-clicked item is NOT selected, select only it
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
      currentSelection = [id];
    }
    // If it IS already selected, do NOT change selection (keep multi-selection)

    const isMulti = currentSelection.length > 1;
    let actions: ContextMenuAction[] = [];
    
    if (type === 'settingsSet' && isMulti) {
      actions = [
        { 
          label: 'Group', 
          onClick: () => { groupItems('cdm', currentSelection); setSelectedIds([]); }
        },
        { 
          label: 'Delete', 
          onClick: () => {
            currentSelection.forEach(selectedId => deleteItem('cdm', selectedId, 'settingsSet'));
            setSelectedIds([]);
          }
        },
      ];
    } else if (type === 'settingsSet') {
      actions = [
        { label: 'Rename', onClick: () => alert('Rename ' + id) },
        { 
          label: 'Delete', 
          onClick: () => {
            deleteItem('cdm', id, 'settingsSet');
            setSelectedIds([]);
          }
        },
      ];
    } else if (type === 'group') {
      actions = [
        { label: 'Ungroup', onClick: () => alert('Ungroup ' + id) },
        { label: 'Rename', onClick: () => alert('Rename group ' + id) },
        { 
          label: 'Delete', 
          onClick: () => {
            deleteItem('cdm', id, 'group');
            setSelectedIds([]);
          }
        },
      ];
    }
    setMenu({ visible: true, x: e.clientX, y: e.clientY, actions });
  };

  const closeContextMenu = () => setMenu(m => ({ ...m, visible: false }));

  return (
    <div style={{ padding: '1rem', minHeight: '500px' }} onClick={handleCanvasClick}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ flex: 1, fontSize: '1.2rem', margin: 0 }}>CDM Panel</h2>
        <button
          style={{ padding: '0.3rem 1rem', borderRadius: 4, background: '#646cff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, marginRight: 8 }}
          onClick={handleSelectAll}
        >
          Select All
        </button>
        <button
          style={{ padding: '0.3rem 1rem', borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, marginRight: 8 }}
          onClick={handleDeselectAll}
        >
          Deselect All
        </button>
        <button
          style={{ padding: '0.3rem 1rem', borderRadius: 4, background: '#646cff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => addSettingsSet('cdm', { name: 'New Settings Set' })}
        >
          + Add Settings Set
        </button>
      </div>
      <div style={{ marginBottom: 8, color: '#aaa', fontSize: '0.95rem' }}>
        {settingsSets.length}/10 settings, {groups.length}/10 groups
      </div>
      
      {/* Render items in unified order */}
      {renderOrder.map(({ type, item }) => {
        if (type === 'group') {
          return (
            <div
              key={item.id}
              onClick={e => handleSelect(item.id, e)}
              onContextMenu={e => openContextMenu(e, item.id, 'group')}
            >
              <Group
                group={item}
                children={getGroupChildren(item.id)}
                isSelected={selectedIds.includes(item.id)}
                selectedChildIds={selectedIds}
                onSelect={e => handleSelect(item.id, e)}
                onChildSelect={(childId, e) => handleSelect(childId, e)}
                onChildContextMenu={(childId, e) => openContextMenu(e, childId, 'settingsSet')}
                onRename={(newName) => renameGroup('cdm', item.id, newName)}
                onChildRename={(childId, newName) => renameSettingsSet('cdm', childId, newName)}
              />
            </div>
          );
        } else {
          return (
            <div
              key={item.id}
              onClick={e => handleSelect(item.id, e)}
              onContextMenu={e => openContextMenu(e, item.id, 'settingsSet')}
            >
              <SettingsSetComponent
                settingsSet={item}
                selected={selectedIds.includes(item.id)}
                onRename={(newName) => renameSettingsSet('cdm', item.id, newName)}
              />
            </div>
          );
        }
      })}

      <ContextMenu
        visible={menu.visible}
        x={menu.x}
        y={menu.y}
        actions={menu.actions}
        onClose={closeContextMenu}
      />
    </div>
  );
};

export default CDMPanel; 