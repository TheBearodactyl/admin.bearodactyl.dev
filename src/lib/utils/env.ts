import { browser } from "$app/environment";

export function getStoredGitHubConfig() {
  if (!browser) return null;

  try {
    const stored = localStorage.getItem("github-config");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeGitHubConfig(config: any) {
  if (!browser) return;

  try {
    localStorage.setItem("github-config", JSON.stringify(config));
  } catch {
  }
}

export function removeStoredGitHubConfig() {
  if (!browser) return;

  try {
    localStorage.removeItem("github-config");
  } catch {
  }
}
