// SettingsSet: Represents a single settings set
export interface SettingsSet {
  id: string;
  name: string;
  isRef?: boolean; // true if doc ref'd
  isRefMod?: boolean; // true if locally modified after ref
  isLocal?: boolean; // true if local only
  sourceId?: string; // id of source if pulled from CDM
  groupId?: string; // parent group id if grouped
}

// Group: Represents a group of settings sets
export interface Group {
  id: string;
  name: string;
  children: string[]; // array of SettingsSet ids
  expanded?: boolean;
  sourceId?: string; // id of source if pulled from CDM
}

// FileState: Represents the state of a file (CDM or Local)
export interface FileState {
  settingsSets: SettingsSet[];
  groups: Group[];
  visualOrder: string[]; // ordered list of item ids for display
}

// AdminRules: Represents admin rule toggles
export interface AdminRules {
  allowReorder: boolean;
}

// AppState: Represents the global app state
export interface AppState {
  cdm: FileState;
  local: FileState;
  adminRules: AdminRules;
} 