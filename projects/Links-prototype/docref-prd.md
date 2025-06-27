# Document Reference Prototype - Product Requirements Document

## Project Overview
Create a prototype application to test document reference (doc ref) behavior between a Central Data Model (CDM) and Local files for Higharc Studio.

## Target Users
- Higharc PDE team members testing doc ref behaviors
- Product managers exploring mutation patterns
- Engineers implementing the final solution

## Core Problem
We need to understand the implications of allowing users to modify document-referenced content locally while maintaining links to a central source. The current system has unclear boundaries around what modifications should be allowed.

## Success Criteria
- All doc ref behaviors are deterministic and predictable
- No data loss scenarios exist
- Users understand consequences of their actions through clear UI
- Edge cases are identified and handled appropriately

## Key Features

### 1. Dual Panel Interface
- Left panel shows CDM (parent) file content
- Right panel shows Local (child) file content
- Visual indicators for linked vs local content

### 2. Settings Sets Management
- Create, rename, delete Settings Sets (max 10 per file)
- Drag-and-drop reordering
- Group multiple Settings Sets together
- Visual hierarchy with indentation

### 3. Document Reference System
- Pull content from CDM to Local via Doc Ref Inspector
- Maintain links between parent and child items
- Show "Ref" tags on linked items
- Show "Ref - Mod" tags on modified linked items

### 4. Admin Testing Rules
- Toggle: Allow reordering within doc ref'd groups
- Toggle: Allow deletion within doc ref'd groups  
- Toggle: Allow adding local items to doc ref'd groups

### 5. Update Management
- Manual pull-based updates (no auto-sync)
- Preview changes before accepting
- Preserve local modifications unless explicitly updated

### 6. Persistence
- Save/Load project states as JSON
- Cloud storage integration
- Multiple named saves

## Technical Requirements

### Data Model
- Unique IDs for all items
- Source ID tracking for links
- Local order tracking for modified groups
- Type system for Settings Sets and Groups

### Business Rules
- New CDM items append to end of locally reordered groups
- Deleted CDM items convert to local (not deleted)
- Groups pulled with existing items merge without duplicates
- No partial group updates

### UI/UX Requirements
- Drag and drop for reordering
- Right-click context menus
- Clear visual distinction between item types
- Disabled states for restricted operations

## Out of Scope
- Actual Settings parameters/values
- Building model generation
- Nested groups
- Undo/redo functionality
- Hiding (vs deleting) items

## Edge Cases to Test
1. Pulling a group containing already-linked items
2. Deleting CDM items that are in local groups
3. Reordering items in doc ref'd groups
4. Admin rule combinations and conflicts

## Implementation Notes
- Use React with TypeScript
- Zustand for state management
- @dnd-kit for drag and drop
- Component-based architecture

## Acceptance Criteria
- [ ] Can create and manage up to 10 Settings Sets
- [ ] Can create and manage up to 10 Groups
- [ ] Doc ref linking works bi-directionally
- [ ] Local modifications persist through updates
- [ ] Order preservation works correctly
- [ ] Admin rules properly restrict operations
- [ ] Save/load functionality works
- [ ] All visual indicators display correctly