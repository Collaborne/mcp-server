export interface ApiClientOptions {
  apiKey?: string;
  baseUrl?: string;
}
export class ApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor({
    apiKey,
    baseUrl = "https://rest.eu-west-1.nextapp.co/v1",
  }: ApiClientOptions) {
    if (!apiKey || apiKey.length === 0) {
      throw new Error("API key is required");
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async getHighlights<T = any>(
    params: {
      from?: number;
      limit?: number;
      playlistsLabels?: string[];
      similarityCutoff?: number;
      sort?: string;
      sortDirection?: "asc" | "desc";
      search_term?: string;
    } = {}
  ): Promise<T[]> {
    return this.fetchApi<T>("search-highlights", params);
  }

  async getClusters<T = any>(
    params: {
      from?: number;
      limit?: number;
      similarityCutoff?: number;
      sort?: string;
      search_term?: string;
    } = {}
  ): Promise<T[]> {
    return this.fetchApi<T>("search-playlists", params);
  }

  async getTags<T = any>(): Promise<T[]> {
    return this.fetchApi<T>("tags");
  }

  /** Internal helper to DRY up common fetch logic */
  private async fetchApi<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/${endpoint}?${queryString}`;

    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.apiKey,
      },
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `API error (${response.status}): ${response.statusText}`
        );
      }
      const parsedResponse = await response.json();
      return (parsedResponse?.items ?? []) as T[];
    } catch (error) {
      process.stderr.write(`Fetch error:${error}`);
      throw error;
    }
  }
}
