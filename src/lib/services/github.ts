import type { DataItem, DataType, GitHubConfig } from "$lib/types";
import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  async getLatestRelease() {
    try {
      const result = await this.octokit.rest.repos.getLatestRelease({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to get latest release: ${message}`);
    }
  }

  async downloadAsset(dataType: DataType): Promise<DataItem[]> {
    try {
      const release = await this.getLatestRelease();
      const asset = release.assets.find((a) => a.name === `${dataType}.json`);

      if (!asset) {
        throw new Error(`Asset ${dataType}.json not found in latest release`);
      }

      const res = await fetch(
        `https://corsproxy.io?url=${asset.browser_download_url}`
      );
      if (!res.ok) {
        throw new Error(`Failed to download asset: ${res.statusText}`);
      }

      const jsonData = await res.json();
      console.log(jsonData);
      return jsonData ?? [];
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to download ${dataType}.json: ${message}`);
    }
  }

  async deleteAsset(assetId: number): Promise<void> {
    try {
      await this.octokit.rest.repos.deleteReleaseAsset({
        owner: this.config.owner,
        repo: this.config.repo,
        asset_id: assetId,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to delete asset: ${message}`);
    }
  }

  async uploadAsset(
    releaseId: number,
    filename: string,
    data: string
  ): Promise<void> {
    try {
      const uploadUrl = `https://uploads.github.com/repos/${
        this.config.owner
      }/${
        this.config.repo
      }/releases/${releaseId}/assets?name=${encodeURIComponent(filename)}`;
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(
        uploadUrl
      )}`;

      const blob = new Blob([data], { type: "application/json" });

      const response = await fetch(proxiedUrl, {
        method: "POST",
        headers: {
          Authorization: `token ${this.config.token}`,
          Accept: "application/vnd.github+json",
        },
        body: blob,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed with status ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to upload asset: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async replaceAsset(dataType: DataType, data: DataItem[]): Promise<void> {
    try {
      const release = await this.getLatestRelease();
      const filename = `${dataType}.json`;

      const assetsResponse = await this.octokit.rest.repos.listReleaseAssets({
        owner: this.config.owner,
        repo: this.config.repo,
        release_id: release.id,
      });
      const assets = assetsResponse.data;
      const existing = assets.find((asset) => asset.name === filename);

      if (existing) {
        console.log(
          `Found existing asset '${filename}' with ID ${existing.id}. Deleting...`
        );
        await this.deleteAsset(existing.id);
        console.log("Existing asset deleted successfully.");
      }

      const jsonData = JSON.stringify(data, null, 2);
      console.log(
        `Uploading new asset '${filename}' to release ID ${release.id}...`
      );
      await this.uploadAsset(release.id, filename, jsonData);
      console.log(
        `Upload of '${filename}' successful to release ID ${release.id}.`
      );
    } catch (error) {
      throw new Error(
        `Failed to replace ${dataType}.json in release v1.0.0: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
