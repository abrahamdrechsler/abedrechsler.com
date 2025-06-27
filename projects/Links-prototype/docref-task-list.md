# Document Reference Prototype - Task List

## Phase 1: Setup & Infrastructure

### Task 1.1: Project Setup
**Priority**: High
**Dependencies**: None
**Estimated Time**: 1 hour

#### Description
Set up the initial React TypeScript project with Vite and install core dependencies.

#### Acceptance Criteria
- [✓] React + TypeScript + Vite project created
- [✓] Dependencies installed: @dnd-kit/sortable, @dnd-kit/core, zustand, uuid, lucide-react
- [✓] Basic folder structure created
- [✓] Project runs with `npm run dev`

#### Testing
Run `npm run dev` and verify the default React app loads at localhost:5173

---

### Task 1.2: Create Base Layout
**Priority**: High
**Dependencies**: 1.1
**Estimated Time**: 2 hours

#### Description
Create the main App.tsx with four-panel layout using CSS Grid.

#### Acceptance Criteria
- [✓] Left sidebar (200px) for Admin Rules
- [✓] Center left (40%) for CDM Panel
- [✓] Center right (40%) for Local Panel  
- [✓] Right sidebar (250px) for Doc Ref Inspector
- [✓] Header with "Doc Ref Prototype" title
- [✓] CSS variables defined for consistent theming

#### Testing
Visual inspection - all four panels should be visible with correct proportions

---

### Task 1.3: Define TypeScript Types
**Priority**: High
**Dependencies**: 1.1
**Estimated Time**: 1 hour

#### Description
Create the types/index.ts file with all interfaces for the application.

#### Acceptance Criteria
- [✓] SettingsSet interface defined
- [✓] Group interface defined
- [✓] FileState interface defined
- [✓] AdminRules interface defined
- [✓] AppState interface defined
- [✓] All types exported

#### Testing
TypeScript compilation succeeds with no errors

---

### Task 1.4: Setup Zustand Store
**Priority**: High
**Dependencies**: 1.3
**Estimated Time**: 2 hours

#### Description
Create the store/useStore.ts with initial state and basic actions.

#### Acceptance Criteria
- [✓] Store initialized with empty CDM and Local files
- [✓] Admin rules with correct defaults
- [✓] Actions: addSettingsSet, deleteItem, updateItem
- [✓] Selectors: getItemById, getItems
- [✓] TypeScript types properly integrated

#### Testing
Import store in App.tsx and verify initial state in React DevTools

---

## Phase 2: Core Components

### Task 2.1: Create SettingsSet Component
**Priority**: High
**Dependencies**: 1.3
**Estimated Time**: 2 hours

#### Description
Create a reusable SettingsSet component for displaying individual settings sets.

#### Acceptance Criteria
- [✓] Displays settings set name
- [✓] Shows appropriate tag (Ref, Ref-Mod, or none)
- [✓] Hover effects
- [✓] Checkbox for selection
- [✓] Props interface defined

#### Testing
Render component with different prop combinations and verify appearance

---

### Task 2.2: Create Group Component
**Priority**: High
**Dependencies**: 2.1
**Estimated Time**: 3 hours

#### Description
Create Group component that can expand/collapse and show child settings sets.

#### Acceptance Criteria
- [✓] Collapsible arrow icon
- [✓] Indented children when expanded
- [✓] Shows group name
- [✓] Displays child SettingsSet components
- [✓] Maintains expanded/collapsed state

#### Testing
Create a group with 3 settings sets and verify expand/collapse works

---

### Task 2.3: Implement CDMPanel Base
**Priority**: High
**Dependencies**: 2.1, 2.2
**Estimated Time**: 3 hours

#### Description
Create CDMPanel component that displays items from the CDM file.

#### Acceptance Criteria
- [ ] Renders list of items from store
- [ ] "Add Settings Set" button works
- [ ] Shows both SettingsSet and Group components
- [ ] Item count display (X/10 settings, Y/10 groups)
- [ ] Connected to Zustand store

#### Testing
Add items via button and verify they appear in the list

---

### Task 2.4: Implement LocalPanel Base
**Priority**: High
**Dependencies**: 2.3
**Estimated Time**: 2 hours

#### Description
Create LocalPanel component similar to CDMPanel but for local file.

#### Acceptance Criteria
- [✓] Renders items from local file in store
- [✓] Shows Ref tags on doc ref'd items
- [✓] Otherwise identical functionality to CDMPanel
- [✓] Connected to Zustand store

#### Testing
Manually add items to local store and verify display

---

## Phase 3: Business Logic

### Task 3.1: Add Drag and Drop to CDMPanel
**Priority**: High
**Dependencies**: 2.3
**Estimated Time**: 4 hours

#### Description
Implement drag and drop reordering using @dnd-kit.

#### Acceptance Criteria
- [✓] Items can be dragged and reordered
- [✓] Visual feedback during drag
- [✓] Store updates on drop
- [✓] Groups and settings sets can be reordered
- [✓] Cannot drop items into groups

#### Testing
Create 5 items and reorder them, verify new order persists

---

### Task 3.2: Add Multi-Select Logic
**Priority**: Medium
**Dependencies**: 2.3
**Estimated Time**: 2 hours

#### Description
Implement checkbox selection for multiple items.

#### Acceptance Criteria
- [✓] Clicking checkbox selects item
- [✓] Selected state stored in component state
- [✓] Visual indication of selection
- [✓] Select all / deselect all functionality
- [✓] Selection cleared after operations

#### Testing
Select multiple items and verify visual state updates correctly

---

### Task 3.3: Implement Context Menus
**Priority**: High
**Dependencies**: 3.2
**Estimated Time**: 3 hours

#### Description
Add right-click context menus with appropriate actions.

#### Acceptance Criteria
- [✓] Single item menu: Rename, Delete
- [✓] Multiple items menu: Group, Delete  
- [✓] Group menu: Ungroup, Rename, Delete
- [✓] Menu positioning follows cursor
- [✓] Click outside closes menu

#### Testing
Right-click various items and verify correct menu options appear

---

### Task 3.4: Implement Grouping Logic
**Priority**: High
**Dependencies**: 3.3
**Estimated Time**: 3 hours

#### Description
Implement the ability to group selected settings sets.

#### Acceptance Criteria
- [ ] Selected items become children of new group
- [ ] Group created with default name
- [ ] Original items removed from root level
- [ ] Store properly updated
- [ ] Cannot group if would exceed 10 groups limit

#### Testing
Select 3 settings sets, group them, verify structure in store

---

### Task 3.5: Create Doc Ref Inspector
**Priority**: High
**Dependencies**: 2.4
**Estimated Time**: 4 hours

#### Description
Create the DocRefInspector component with tree view of CDM items.

#### Acceptance Criteria
- [ ] Tree view of all CDM items
- [ ] Checkboxes for selection
- [ ] Expand/collapse for groups
- [ ] "Pull Selected" button
- [ ] Already-linked items highlighted
- [ ] Shows in right sidebar

#### Testing
Verify all CDM items appear with correct hierarchy

---

## Phase 4: Integration

### Task 4.1: Implement Pull Functionality
**Priority**: High
**Dependencies**: 3.5
**Estimated Time**: 4 hours

#### Description
Implement the core doc ref pulling mechanism.

#### Acceptance Criteria
- [ ] Pulling items creates linked copies in local
- [ ] Sets correct isLocal and sourceId properties
- [ ] No duplicates created (check by sourceId)
- [ ] Groups maintain their structure
- [ ] Success feedback shown

#### Testing
Pull individual items and groups, verify correct properties set

---

### Task 4.2: Handle Group Merge Logic
**Priority**: High
**Dependencies**: 4.1
**Estimated Time**: 3 hours

#### Description
Handle the complex case of pulling groups containing already-linked items.

#### Acceptance Criteria
- [ ] Existing linked items move into the group
- [ ] No duplicates created
- [ ] Links preserved
- [ ] Local items not affected
- [ ] Order maintained

#### Testing
Pull items individually, then pull a group containing them

---

### Task 4.3: Implement Admin Rules
**Priority**: High
**Dependencies**: 2.4, 3.1
**Estimated Time**: 3 hours

#### Description
Create AdminRules component and connect rules to UI behaviors.

#### Acceptance Criteria
- [ ] Three toggle switches in left sidebar
- [ ] Rules stored in Zustand
- [ ] Drag disabled when reorder rule is off
- [ ] Context menu options disabled based on rules
- [ ] Visual feedback for disabled states

#### Testing
Toggle each rule and verify UI updates accordingly

---

### Task 4.4: Implement Update Detection
**Priority**: Medium
**Dependencies**: 4.1
**Estimated Time**: 3 hours

#### Description
Add ability to detect when CDM items have changed.

#### Acceptance Criteria
- [ ] Compare CDM and linked local items
- [ ] Show "Update Available" indicator
- [ ] List which items have updates
- [ ] "Update All" button in inspector
- [ ] Individual update buttons per item

#### Testing
Modify CDM item after pulling, verify update detected

---

### Task 4.5: Implement Order Persistence
**Priority**: High
**Dependencies**: 4.4
**Estimated Time**: 4 hours

#### Description
Implement local order preservation for modified groups.

#### Acceptance Criteria
- [ ] Reordering in local marks group as modified
- [ ] LocalOrder array tracks custom order
- [ ] Updates preserve local order
- [ ] New items append to end
- [ ] "Ref - Mod" tag shown

#### Testing
Reorder group locally, update from CDM, verify order preserved

---

## Phase 5: Polish & Edge Cases

### Task 5.1: Handle CDM Deletion
**Priority**: High
**Dependencies**: 4.5
**Estimated Time**: 3 hours

#### Description
Handle cases where CDM items are deleted.

#### Acceptance Criteria
- [ ] Deleted items convert to local
- [ ] SourceId cleared, isLocal set to true
- [ ] Items in groups move out of group
- [ ] User notified of broken links
- [ ] No data loss

#### Testing
Delete CDM items that are linked, verify conversion

---

### Task 5.2: Add Rename Functionality
**Priority**: Medium
**Dependencies**: 3.3
**Estimated Time**: 2 hours

#### Description
Implement inline renaming for items.

#### Acceptance Criteria
- [ ] Click rename shows input field
- [ ] Enter key saves, Escape cancels
- [ ] Only local items can be renamed
- [ ] Validation for empty names
- [ ] Store updates properly

#### Testing
Rename various items and verify changes persist

---

### Task 5.3: Implement Save/Load
**Priority**: Medium
**Dependencies**: 5.1
**Estimated Time**: 4 hours

#### Description
Add ability to save and load project states.

#### Acceptance Criteria
- [ ] Save button exports state as JSON
- [ ] Save As with name prompt
- [ ] Load button with file picker
- [ ] Recent saves list in localStorage
- [ ] Confirmation before overwriting

#### Testing
Save state, make changes, load state, verify restoration

---

### Task 5.4: Add Visual Polish
**Priority**: Low
**Dependencies**: 5.2
**Estimated Time**: 3 hours

#### Description
Add transitions, loading states, and polish the UI.

#### Acceptance Criteria
- [ ] Smooth transitions for drag and drop
- [ ] Loading states for async operations
- [ ] Error states with helpful messages
- [ ] Tooltips for unclear actions
- [ ] Consistent spacing and alignment

#### Testing
Visual inspection of all interactions

---

### Task 5.5: Comprehensive Testing
**Priority**: High
**Dependencies**: All previous tasks
**Estimated Time**: 4 hours

#### Description
Test all edge cases and create a test checklist.

#### Acceptance Criteria
- [ ] Test all PRD edge cases
- [ ] Document any bugs found
- [ ] Verify all admin rule combinations
- [ ] Test with maximum items (10 each)
- [ ] Create demo scenario for team

#### Testing
Run through the complete edge case checklist

---

## Summary
- Total Tasks: 25
- Estimated Time: ~72 hours
- Dependencies are clearly mapped
- Each task is independently testable