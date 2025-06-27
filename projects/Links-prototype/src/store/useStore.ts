import { create } from 'zustand';
import type { AppState, SettingsSet, Group, FileState, AdminRules } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Store extends AppState {
  // Actions
  addSettingsSet: (panel: 'cdm' | 'local', settingsSet: Partial<SettingsSet>) => void;
  deleteItem: (panel: 'cdm' | 'local', id: string, type: 'settingsSet' | 'group') => void;
  updateItem: (panel: 'cdm' | 'local', id: string, type: 'settingsSet' | 'group', updates: Partial<SettingsSet> | Partial<Group>) => void;
  reorderItems: (panel: 'cdm' | 'local', newOrder: string[]) => void;
  groupItems: (panel: 'cdm' | 'local', itemIds: string[]) => void;
  moveItemToGroup: (panel: 'cdm' | 'local', itemId: string, targetGroupId: string, index?: number) => void;
  moveItemToRoot: (panel: 'cdm' | 'local', itemId: string, index: number) => void;
  reorderWithinGroup: (panel: 'cdm' | 'local', groupId: string, itemIds: string[]) => void;
  renameSettingsSet: (panel: 'cdm' | 'local', id: string, newName: string) => void;
  renameGroup: (panel: 'cdm' | 'local', id: string, newName: string) => void;
  pullItems: (itemIds: string[]) => void;
  updateAdminRules: (rules: AdminRules) => void;
  updateLinkedItems: (itemIds: string[]) => void;
  getOutdatedItems: () => string[];
  // Selectors
  getItemById: (panel: 'cdm' | 'local', id: string, type: 'settingsSet' | 'group') => SettingsSet | Group | undefined;
  getItems: (panel: 'cdm' | 'local', type: 'settingsSet' | 'group') => (SettingsSet[] | Group[]);
}

const defaultAdminRules: AdminRules = {
  allowReorder: true,
};

const emptyFileState: FileState = {
  settingsSets: [],
  groups: [],
  visualOrder: [],
};

export const useStore = create<Store>((set, get) => ({
  cdm: { ...emptyFileState },
  local: { ...emptyFileState },
  adminRules: { ...defaultAdminRules },

  // Actions
  addSettingsSet: (panel, settingsSet) => {
    const newId = uuidv4();
    set(state => ({
      [panel]: {
        ...state[panel],
        settingsSets: [
          ...state[panel].settingsSets,
          { id: newId, name: settingsSet.name || 'New Settings Set', ...settingsSet },
        ],
        visualOrder: [...state[panel].visualOrder, newId],
      },
    }));
  },
  deleteItem: (panel, id, type) => {
    set(state => {
      const currentState = state[panel];
      let updatedSettingsSets = [...currentState.settingsSets];
      let updatedGroups = [...currentState.groups];
      let updatedVisualOrder = [...currentState.visualOrder];

      if (type === 'settingsSet') {
        // Remove the settings set
        updatedSettingsSets = updatedSettingsSets.filter(s => s.id !== id);
        
        // Remove from visual order
        updatedVisualOrder = updatedVisualOrder.filter(orderId => orderId !== id);
        
        // Remove from any group's children
        updatedGroups = updatedGroups.map(group => ({
          ...group,
          children: group.children.filter(childId => childId !== id)
        }));
      } else if (type === 'group') {
        const groupToDelete = updatedGroups.find(g => g.id === id);
        
        if (groupToDelete) {
          // Move all children of the group back to root level at the group's position
          const groupIndex = updatedVisualOrder.indexOf(id);
          
          // Remove group ID from visual order
          updatedVisualOrder = updatedVisualOrder.filter(orderId => orderId !== id);
          
          // Insert children at the group's former position
          if (groupIndex !== -1 && groupToDelete.children.length > 0) {
            updatedVisualOrder.splice(groupIndex, 0, ...groupToDelete.children);
          }
          
          // Update settings sets to remove groupId
          updatedSettingsSets = updatedSettingsSets.map(set => 
            groupToDelete.children.includes(set.id) 
              ? { ...set, groupId: undefined } 
              : set
          );
          
          // Remove the group
          updatedGroups = updatedGroups.filter(g => g.id !== id);
        }
      }

      return {
        [panel]: {
          ...currentState,
          settingsSets: updatedSettingsSets,
          groups: updatedGroups,
          visualOrder: updatedVisualOrder,
        },
      };
    });
  },
  updateItem: (panel, id, type, updates) => {
    set(state => ({
      [panel]: {
        ...state[panel],
        settingsSets: type === 'settingsSet'
          ? state[panel].settingsSets.map(s => s.id === id ? { ...s, ...(updates as Partial<SettingsSet>) } : s)
          : state[panel].settingsSets,
        groups: type === 'group'
          ? state[panel].groups.map(g => g.id === id ? { ...g, ...(updates as Partial<Group>) } : g)
          : state[panel].groups,
      },
    }));
  },
  reorderItems: (panel, newOrder) => {
    set(state => ({
      [panel]: {
        ...state[panel],
        visualOrder: newOrder,
      },
    }));
  },
  groupItems: (panel, itemIds) => {
    set(state => {
      // Check if we would exceed the 10 groups limit
      if (state[panel].groups.length >= 10) {
        console.warn('Cannot create more than 10 groups');
        return state;
      }

      const groups = state[panel].groups;
      const settingsSets = state[panel].settingsSets;
      const currentVisualOrder = state[panel].visualOrder;
      
      // Find the position of the topmost selected item
      const selectedPositions = itemIds.map(id => currentVisualOrder.indexOf(id)).filter(pos => pos !== -1);
      const insertPosition = Math.min(...selectedPositions);

      // Create new group
      const groupId = uuidv4();
      const newGroup: Group = {
        id: groupId,
        name: `Group ${groups.length + 1}`,
        children: itemIds,
        expanded: true,
      };

      // Update selected settings sets to be in the new group
      const updatedSettingsSets = settingsSets.map(set => 
        itemIds.includes(set.id) ? { ...set, groupId } : set
      );

      // Update visual order: remove selected items and insert group at correct position
      const newVisualOrder = currentVisualOrder.filter(id => !itemIds.includes(id));
      newVisualOrder.splice(insertPosition, 0, groupId);

      return {
        [panel]: {
          ...state[panel],
          groups: [...groups, newGroup],
          settingsSets: updatedSettingsSets,
          visualOrder: newVisualOrder,
        },
      };
    });
  },
  
  moveItemToGroup: (panel, itemId, targetGroupId, index = 0) => {
    set(state => {
      const settingsSets = state[panel].settingsSets;
      const groups = state[panel].groups;
      const currentVisualOrder = state[panel].visualOrder;
      
      // Update the item to be in the target group
      const updatedSettingsSets = settingsSets.map(set => 
        set.id === itemId ? { ...set, groupId: targetGroupId } : set
      );
      
      // Remove item from visual order (it's now inside a group)
      const newVisualOrder = currentVisualOrder.filter(id => id !== itemId);
      
      // Update the target group's children
      const updatedGroups = groups.map(group => {
        if (group.id === targetGroupId) {
          const newChildren = [...group.children];
          if (!newChildren.includes(itemId)) {
            newChildren.splice(index, 0, itemId);
          }
          return { ...group, children: newChildren };
        }
        return group;
      });
      
      return {
        [panel]: {
          ...state[panel],
          settingsSets: updatedSettingsSets,
          groups: updatedGroups,
          visualOrder: newVisualOrder,
        },
      };
    });
  },
  
  moveItemToRoot: (panel, itemId, index) => {
    set(state => {
      const settingsSets = state[panel].settingsSets;
      const groups = state[panel].groups;
      const currentVisualOrder = state[panel].visualOrder;
      
      // Remove item from its current group
      const updatedSettingsSets = settingsSets.map(set => 
        set.id === itemId ? { ...set, groupId: undefined } : set
      );
      
      // Remove item from all group children
      const updatedGroups = groups.map(group => ({
        ...group,
        children: group.children.filter(childId => childId !== itemId)
      }));
      
      // Add item to visual order at specified index
      const newVisualOrder = [...currentVisualOrder];
      if (!newVisualOrder.includes(itemId)) {
        newVisualOrder.splice(index, 0, itemId);
      }
      
      return {
        [panel]: {
          ...state[panel],
          settingsSets: updatedSettingsSets,
          groups: updatedGroups,
          visualOrder: newVisualOrder,
        },
      };
    });
  },
  
  reorderWithinGroup: (panel, groupId, itemIds) => {
    set(state => {
      const groups = state[panel].groups;
      
      const updatedGroups = groups.map(group => 
        group.id === groupId ? { ...group, children: itemIds } : group
      );
      
      return {
        [panel]: {
          ...state[panel],
          groups: updatedGroups,
        },
      };
    });
  },
  
  renameSettingsSet: (panel, id, newName) => {
    set(state => ({
      [panel]: {
        ...state[panel],
        settingsSets: state[panel].settingsSets.map(set =>
          set.id === id ? { ...set, name: newName } : set
        ),
      },
    }));
  },
  
  renameGroup: (panel, id, newName) => {
    set(state => ({
      [panel]: {
        ...state[panel],
        groups: state[panel].groups.map(group =>
          group.id === id ? { ...group, name: newName } : group
        ),
      },
    }));
  },

  pullItems: (itemIds) => {
    set(state => {
      const cdmState = state.cdm;
      const localState = state.local;
      const newLocalSettingsSets = [...localState.settingsSets];
      const newLocalGroups = [...localState.groups];
      const newLocalVisualOrder = [...localState.visualOrder];

      itemIds.forEach(itemId => {
        // Check if item is a group or settings set in CDM
        const cdmGroup = cdmState.groups.find(g => g.id === itemId);
        const cdmSettingsSet = cdmState.settingsSets.find(s => s.id === itemId);

        if (cdmGroup) {
          // Pulling a group
          // Check if group already exists in local (by sourceId)
          const existingLocalGroup = newLocalGroups.find(g => g.sourceId === itemId);
          
          if (!existingLocalGroup) {
            // Create new linked group
            const newGroupId = uuidv4();
            const newGroup: Group = {
              id: newGroupId,
              name: cdmGroup.name,
              children: [],
              expanded: cdmGroup.expanded,
              sourceId: itemId
            };

            // Pull all children of the group
            const childrenToPull = cdmGroup.children.map(childId => {
              const cdmChild = cdmState.settingsSets.find(s => s.id === childId);
              if (!cdmChild) return null;

              // Check if child already exists in local
              const existingLocalChild = newLocalSettingsSets.find(s => s.sourceId === childId);
              
              if (existingLocalChild) {
                // Move existing child into this group
                existingLocalChild.groupId = newGroupId;
                return existingLocalChild.id;
              } else {
                // Create new linked child
                const newChildId = uuidv4();
                const newChild: SettingsSet = {
                  id: newChildId,
                  name: cdmChild.name,
                  isRef: true,
                  isLocal: false,
                  sourceId: childId,
                  groupId: newGroupId
                };
                
                newLocalSettingsSets.push(newChild);
                return newChildId;
              }
            }).filter(Boolean) as string[];

            newGroup.children = childrenToPull;
            newLocalGroups.push(newGroup);
            
            // Add group to visual order
            newLocalVisualOrder.push(newGroupId);
          }
        } else if (cdmSettingsSet) {
          // Pulling a settings set
          // Check if already exists in local (by sourceId)
          const existingLocalSet = newLocalSettingsSets.find(s => s.sourceId === itemId);
          
          if (!existingLocalSet) {
            // Create new linked settings set
            const newId = uuidv4();
            const newSettingsSet: SettingsSet = {
              id: newId,
              name: cdmSettingsSet.name,
              isRef: true,
              isLocal: false,
              sourceId: itemId,
              groupId: undefined // Will be root level initially
            };
            
            newLocalSettingsSets.push(newSettingsSet);
            
            // Add to visual order (at end)
            newLocalVisualOrder.push(newId);
          }
        }
      });

      return {
        ...state,
        local: {
          ...localState,
          settingsSets: newLocalSettingsSets,
          groups: newLocalGroups,
          visualOrder: newLocalVisualOrder,
        },
      };
         });
   },

   updateAdminRules: (rules) => {
     set(state => ({
       ...state,
       adminRules: rules,
     }));
   },

   updateLinkedItems: (itemIds) => {
     set(state => {
       const cdmState = state.cdm;
       const localState = state.local;
       const updatedLocalSettingsSets = [...localState.settingsSets];
       const updatedLocalGroups = [...localState.groups];

       itemIds.forEach(itemId => {
         // Find the local item that references this CDM item
         const localItem = updatedLocalSettingsSets.find(s => s.sourceId === itemId);
         const localGroup = updatedLocalGroups.find(g => g.sourceId === itemId);

         if (localItem) {
           // Update settings set
           const cdmItem = cdmState.settingsSets.find(s => s.id === itemId);
           if (cdmItem) {
             const index = updatedLocalSettingsSets.findIndex(s => s.sourceId === itemId);
             updatedLocalSettingsSets[index] = {
               ...localItem,
               name: cdmItem.name,
               // Keep local properties like id, groupId, but update content
             };
           }
         }

         if (localGroup) {
           // Update group
           const cdmGroup = cdmState.groups.find(g => g.id === itemId);
           if (cdmGroup) {
             const index = updatedLocalGroups.findIndex(g => g.sourceId === itemId);
             updatedLocalGroups[index] = {
               ...localGroup,
               name: cdmGroup.name,
               // Keep local properties like id, but update content
             };
           }
         }
       });

       return {
         ...state,
         local: {
           ...localState,
           settingsSets: updatedLocalSettingsSets,
           groups: updatedLocalGroups,
         },
       };
     });
   },

   getOutdatedItems: () => {
     const state = get();
     const outdatedIds: string[] = [];

     // Check outdated settings sets
     state.local.settingsSets.forEach(localItem => {
       if (localItem.sourceId) {
         const cdmItem = state.cdm.settingsSets.find(s => s.id === localItem.sourceId);
         if (cdmItem && cdmItem.name !== localItem.name) {
           outdatedIds.push(localItem.sourceId);
         }
       }
     });

     // Check outdated groups
     state.local.groups.forEach(localGroup => {
       if (localGroup.sourceId) {
         const cdmGroup = state.cdm.groups.find(g => g.id === localGroup.sourceId);
         if (cdmGroup && cdmGroup.name !== localGroup.name) {
           outdatedIds.push(localGroup.sourceId);
         }
       }
     });

     return outdatedIds;
   },
   
   // Selectors
  getItemById: (panel, id, type) => {
    const state = get();
    if (type === 'settingsSet') {
      return state[panel].settingsSets.find(s => s.id === id);
    } else {
      return state[panel].groups.find(g => g.id === id);
    }
  },
  getItems: (panel, type) => {
    const state = get();
    return type === 'settingsSet' ? state[panel].settingsSets : state[panel].groups;
  },
})); 