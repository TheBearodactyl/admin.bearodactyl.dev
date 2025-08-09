import type { DataType, DataItem, AppError, GitHubConfig } from "../types.js";
import { GitHubService } from "../services/github.js";
import { getStoredGitHubConfig, removeStoredGitHubConfig, storeGitHubConfig } from "$lib/utils/env.js";

interface AppState {
  books: DataItem[];
  games: DataItem[];
  reviews: DataItem[];
  projects: DataItem[];
  loading: boolean;
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
    loading: false,
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

  function initFromStorage() {
    const stored = getStoredGitHubConfig();
    if (stored) {
      initGitHub(stored);
    }
  }

  initFromStorage();

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

    state.loading = true;
    try {
      const data = await githubService.downloadAsset(dataType);
      state[dataType] = data;
      addError(`Successfully downloaded ${dataType}.json`, "info");
    } catch (error) {
      addError(
        `Failed to download ${dataType}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      state.loading = false;
    }
  }

  async function uploadData(dataType: DataType) {
    if (!githubService) {
      addError("GitHub service not initialized");
      return;
    }

    state.loading = true;
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
      state.loading = false;
    }
  }

  function setActiveDataType(dataType: DataType | null) {
    state.activeDataType = dataType;
    state.rawEditMode = false;
  }

  function toggleRawEditMode() {
    if (state.activeDataType) {
      state.rawEditMode = !state.rawEditMode;
      if (state.rawEditMode) {
        state.rawContent = JSON.stringify(state[state.activeDataType], null, 2);
      } else {
        try {
          const parsed = JSON.parse(state.rawContent);
          if (Array.isArray(parsed)) {
            state[state.activeDataType] = parsed;
            addError("Raw content applied successfully", "info");
          } else {
            addError("Raw content must be an array");
          }
        } catch (error) {
          addError("Invalid JSON in raw content");
        }
      }
    }
  }

  function updateRawContent(content: string) {
    state.rawContent = content;
  }

  function updateItem(dataType: DataType, index: number, item: DataItem) {
    const items = [...state[dataType]];
    items[index] = item;
    state[dataType] = items;
  }

  function addItem(dataType: DataType, item: DataItem) {
    state[dataType] = [...state[dataType], item];
  }

  function removeItem(dataType: DataType, index: number) {
    const items = [...state[dataType]];
    items.splice(index, 1);
    state[dataType] = items;
  }

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
    updateRawContent,
    updateItem,
    addItem,
    removeItem,
  };
}

export const appState = createAppState();
