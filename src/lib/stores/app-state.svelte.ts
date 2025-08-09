import type { DataType, DataItem, AppError, GitHubConfig } from "../types.js";
import { GitHubService } from "../services/github.js";
import {
  getStoredGitHubConfig,
  storeGitHubConfig,
  removeStoredGitHubConfig,
} from "../utils/env.js";

interface AppState {
  books: DataItem[];
  games: DataItem[];
  reviews: DataItem[];
  projects: DataItem[];
  loading: DataType | null;
  errors: AppError[];
  githubConfig: GitHubConfig | null;
  activeDataType: DataType | null;
  rawEditMode: boolean;
  rawContent: string;
}

function createAppState() {
  let state = $state<AppState>({
    books: [],
    games: [],
    reviews: [],
    projects: [],
    loading: null,
    errors: [],
    githubConfig: null,
    activeDataType: null,
    rawEditMode: false,
    rawContent: "",
  });

  let githubService: GitHubService | null = null;

  function initGitHub(config: GitHubConfig | null) {
    if (config) {
      state.githubConfig = config;
      githubService = new GitHubService(config);
      storeGitHubConfig(config);
    } else {
      state.githubConfig = null;
      githubService = null;
      removeStoredGitHubConfig();
    }
  }

  function addError(message: string, type: AppError["type"] = "error") {
    const error: AppError = {
      message,
      type,
      timestamp: Date.now(),
    };
    state.errors = [...state.errors, error];

    // Auto-remove errors after 5 seconds
    setTimeout(() => {
      state.errors = state.errors.filter(
        (e) => e.timestamp !== error.timestamp
      );
    }, 5000);
  }

  function clearErrors() {
    state.errors = [];
  }

  async function downloadData(dataType: DataType) {
    if (!githubService) {
      addError("GitHub service not initialized");
      return;
    }

    state.loading = dataType;
    try {
      const data = await githubService.downloadAsset(dataType);
      state[dataType] = data;

      // Update raw content if this is the active data type
      if (state.activeDataType === dataType) {
        state.rawContent = JSON.stringify(data, null, 2);
      }

      addError(`Successfully downloaded ${dataType}.json`, "info");
    } catch (error) {
      addError(
        `Failed to download ${dataType}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      state.loading = null;
    }
  }

  async function uploadData(dataType: DataType) {
    if (!githubService) {
      addError("GitHub service not initialized");
      return;
    }

    state.loading = dataType;
    try {
      await githubService.replaceAsset(dataType, state[dataType]);
      addError(`Successfully uploaded ${dataType}.json`, "info");
    } catch (error) {
      addError(
        `Failed to upload ${dataType}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      state.loading = null;
    }
  }

  function setActiveDataType(dataType: DataType | null) {
    state.activeDataType = dataType;
    state.rawEditMode = false;

    // Initialize raw content when setting active data type
    if (dataType) {
      state.rawContent = JSON.stringify(state[dataType], null, 2);
    } else {
      state.rawContent = "";
    }
  }

  function toggleRawEditMode() {
    if (state.activeDataType) {
      if (!state.rawEditMode) {
        state.rawContent = JSON.stringify(state[state.activeDataType], null, 2);
        state.rawEditMode = true;
      } else {
        // Exiting raw edit mode - try to apply changes
        try {
          const parsed = JSON.parse(state.rawContent);
          if (Array.isArray(parsed)) {
            state[state.activeDataType] = parsed;
            addError("Raw content applied successfully", "info");
            state.rawEditMode = false;
          } else {
            addError("Raw content must be an array");
            return; // Don't exit raw mode if data is invalid
          }
        } catch (error) {
          addError("Invalid JSON in raw content");
          return; // Don't exit raw mode if JSON is invalid
        }
      }
    }
  }

  function exitRawEditMode() {
    if (state.activeDataType) {
      // Reset raw content to current data and exit
      state.rawContent = JSON.stringify(state[state.activeDataType], null, 2);
      state.rawEditMode = false;
    }
  }

  function updateRawContent(content: string) {
    state.rawContent = content;
  }

  function updateItem(dataType: DataType, index: number, item: DataItem) {
    const items = [...state[dataType]];
    items[index] = item;
    state[dataType] = items;

    // Update raw content if in raw edit mode for this data type
    if (state.activeDataType === dataType && !state.rawEditMode) {
      state.rawContent = JSON.stringify(items, null, 2);
    }
  }

  function addItem(dataType: DataType, item: DataItem) {
    const items = [...state[dataType], item];
    state[dataType] = items;

    // Update raw content if in raw edit mode for this data type
    if (state.activeDataType === dataType && !state.rawEditMode) {
      state.rawContent = JSON.stringify(items, null, 2);
    }
  }

  function removeItem(dataType: DataType, index: number) {
    const items = [...state[dataType]];
    items.splice(index, 1);
    state[dataType] = items;

    if (state.activeDataType === dataType && !state.rawEditMode) {
      state.rawContent = JSON.stringify(items, null, 2);
    }
  }

  function initFromStorage() {
    const stored = getStoredGitHubConfig();
    if (stored) {
      initGitHub(stored);
    }
  }

  function removeError(timestamp: number) {
    state.errors = state.errors.filter((e) => e.timestamp !== timestamp);
  }

  initFromStorage();

  return {
    get state() {
      return state;
    },
    initGitHub,
    addError,
    clearErrors,
    downloadData,
    uploadData,
    setActiveDataType,
    toggleRawEditMode,
    exitRawEditMode,
    updateRawContent,
    updateItem,
    addItem,
    removeItem,
    removeError
  };
}

export const appState = createAppState();
