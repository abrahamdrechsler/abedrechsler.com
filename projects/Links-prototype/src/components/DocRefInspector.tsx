import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronRight, ChevronDown } from 'lucide-react';

const DocRefInspector: React.FC = () => {
  const cdmSettingsSets = useStore(state => state.cdm.settingsSets);
  const cdmGroups = useStore(state => state.cdm.groups);
  const cdmVisualOrder = useStore(state => state.cdm.visualOrder);
  const localSettingsSets = useStore(state => state.local.settingsSets);
  const pullItems = useStore(state => state.pullItems);
  const updateLinkedItems = useStore(state => state.updateLinkedItems);
  const getOutdatedItems = useStore(state => state.getOutdatedItems);
  
  // Track selected items for pulling
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Helper to check if an item is already linked (exists in local with sourceId)
  const isAlreadyLinked = (cdmId: string): boolean => {
    return localSettingsSets.some(localSet => localSet.sourceId === cdmId);
  };

  // Helper to check if an item needs an update
  const outdatedItems = getOutdatedItems();
  const needsUpdate = (cdmId: string): boolean => {
    return outdatedItems.includes(cdmId);
  };

  // Helper to get group children
  const getGroupChildren = (groupId: string) =>
    cdmSettingsSets.filter(set => set.groupId === groupId);

  // Root-level settings sets (not in any group)
  const rootSettingsSets = cdmSettingsSets.filter(set => !set.groupId);

  // Create unified rendering order using CDM visual order
  const renderOrder = cdmVisualOrder.map(id => {
    const group = cdmGroups.find(g => g.id === id);
    if (group) {
      return { type: 'group' as const, item: group };
    }
    const settingsSet = rootSettingsSets.find(s => s.id === id);
    if (settingsSet) {
      return { type: 'settingsSet' as const, item: settingsSet };
    }
    return null;
  }).filter(Boolean) as Array<{ type: 'group' | 'settingsSet', item: any }>;

  // Handle checkbox selection
  const handleItemSelect = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  // Handle group selection (select/deselect all children)
  const handleGroupSelect = (groupId: string, isSelected: boolean) => {
    const children = getGroupChildren(groupId);
    const childIds = children.map(child => child.id);
    
    if (isSelected) {
      setSelectedIds(prev => [...prev, groupId, ...childIds]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== groupId && !childIds.includes(id)));
    }
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Handle pull selected items
  const handlePullSelected = () => {
    if (selectedIds.length === 0) return;
    
    // Pull the selected items from CDM to Local
    pullItems(selectedIds);
    setSelectedIds([]);
  };

  // Handle update selected items
  const handleUpdateSelected = () => {
    const outdatedSelected = selectedIds.filter(id => needsUpdate(id));
    if (outdatedSelected.length === 0) return;
    
    updateLinkedItems(outdatedSelected);
    setSelectedIds([]);
  };

  // Handle update all outdated items
  const handleUpdateAll = () => {
    if (outdatedItems.length === 0) return;
    
    updateLinkedItems(outdatedItems);
  };

  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', margin: 0, flex: 1 }}>Doc Ref Inspector</h3>
        
        {outdatedItems.length > 0 && (
          <button
            onClick={handleUpdateAll}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            Update All ({outdatedItems.length})
          </button>
        )}
        
        {selectedIds.some(id => needsUpdate(id)) && (
          <button
            onClick={handleUpdateSelected}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            Update Selected
          </button>
        )}
        
        <button
          onClick={handlePullSelected}
          disabled={selectedIds.length === 0}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            background: selectedIds.length > 0 ? '#646cff' : '#666',
            color: '#fff',
            border: 'none',
            cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          Pull Selected ({selectedIds.length})
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderOrder.map(({ type, item }) => {
          if (type === 'group') {
            const isExpanded = expandedGroups.has(item.id);
            const children = getGroupChildren(item.id);
            const isGroupSelected = selectedIds.includes(item.id);
            const allChildrenSelected = children.length > 0 && children.every(child => selectedIds.includes(child.id));
            const someChildrenSelected = children.some(child => selectedIds.includes(child.id));
            const isIndeterminate = someChildrenSelected && !allChildrenSelected && !isGroupSelected;
            const groupNeedsUpdate = needsUpdate(item.id);

            return (
              <div key={item.id} style={{ marginBottom: '4px' }}>
                {/* Group header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  background: groupNeedsUpdate ? 'rgba(245, 158, 11, 0.1)' : 
                            isAlreadyLinked(item.id) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: groupNeedsUpdate ? '1px solid rgba(245, 158, 11, 0.4)' :
                         isAlreadyLinked(item.id) ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <input
                    type="checkbox"
                    checked={isGroupSelected || allChildrenSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleGroupSelect(item.id, e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <button
                    onClick={() => toggleGroupExpansion(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '2px',
                      marginRight: '6px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span style={{ 
                    fontWeight: 600, 
                    color: groupNeedsUpdate ? '#f59e0b' :
                           isAlreadyLinked(item.id) ? '#22c55e' : 'inherit',
                    flex: 1
                  }}>
                    {item.name}
                  </span>
                  {groupNeedsUpdate && (
                    <button
                      onClick={() => updateLinkedItems([item.id])}
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        background: '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        marginRight: '4px'
                      }}
                    >
                      Update
                    </button>
                  )}
                  {isAlreadyLinked(item.id) && !groupNeedsUpdate && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      fontWeight: 600
                    }}>
                      Linked
                    </span>
                  )}
                </div>

                {/* Group children */}
                {isExpanded && (
                  <div style={{ marginLeft: '24px', marginTop: '4px' }}>
                    {children.map(child => {
                      const isChildSelected = selectedIds.includes(child.id);
                      const isChildLinked = isAlreadyLinked(child.id);
                      const childNeedsUpdate = needsUpdate(child.id);
                      
                      return (
                        <div
                          key={child.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 8px',
                            marginBottom: '2px',
                            background: childNeedsUpdate ? 'rgba(245, 158, 11, 0.1)' :
                                       isChildLinked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                            border: childNeedsUpdate ? '1px solid rgba(245, 158, 11, 0.3)' :
                                   isChildLinked ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChildSelected}
                            onChange={(e) => handleItemSelect(child.id, e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <span style={{ 
                            flex: 1,
                            color: childNeedsUpdate ? '#f59e0b' :
                                   isChildLinked ? '#22c55e' : 'inherit'
                          }}>
                            {child.name}
                          </span>
                          {childNeedsUpdate && (
                            <button
                              onClick={() => updateLinkedItems([child.id])}
                              style={{
                                fontSize: '0.65rem',
                                padding: '1px 4px',
                                borderRadius: '6px',
                                background: '#f59e0b',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                marginRight: '2px'
                              }}
                            >
                              Update
                            </button>
                          )}
                          {isChildLinked && !childNeedsUpdate && (
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '1px 4px',
                              borderRadius: '8px',
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#22c55e',
                              fontWeight: 600
                            }}>
                              Linked
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            // Root-level settings set
            const isSelected = selectedIds.includes(item.id);
            const isLinked = isAlreadyLinked(item.id);
            const itemNeedsUpdate = needsUpdate(item.id);
            
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  marginBottom: '4px',
                  background: itemNeedsUpdate ? 'rgba(245, 158, 11, 0.1)' :
                             isLinked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: itemNeedsUpdate ? '1px solid rgba(245, 158, 11, 0.4)' :
                         isLinked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ 
                  flex: 1,
                  color: itemNeedsUpdate ? '#f59e0b' :
                         isLinked ? '#22c55e' : 'inherit'
                }}>
                  {item.name}
                </span>
                {itemNeedsUpdate && (
                  <button
                    onClick={() => updateLinkedItems([item.id])}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      background: '#f59e0b',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      marginRight: '4px'
                    }}
                  >
                    Update
                  </button>
                )}
                {isLinked && !itemNeedsUpdate && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    fontWeight: 600
                  }}>
                    Linked
                  </span>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default DocRefInspector; 