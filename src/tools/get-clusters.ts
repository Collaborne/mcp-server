import { createErrorResponse } from "../helpers/createErrorResponse.js";
import { ApiClient } from "../resources/apiClient.js";

import type { IMCPTool, MinimalPlaylist } from "../types.js";
import { buildPlaylistsForPrompt } from "../utils/build-clusters-response.js";
import z from "zod";

export class GetClustersTool implements IMCPTool {
  readonly name = "next-get-clusters";

  readonly description =
    "Used to fetch insight nuggets from User Interviews, Sales Calls, etc. Best used for specific details about a topic";

  readonly parameters = {
    query: z
      .string()
      .describe(
        "Used to search for specific clusters based on user question or empty string"
      ),
  };

  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async execute(args: { query?: string }) {
    try {
      const clusters = await this.apiClient.getClusters<MinimalPlaylist>({
        search_term: args?.query ?? "",
      });
      const clustersStr = buildPlaylistsForPrompt(clusters);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(clustersStr, null, 2),
          },
        ],
      };
    } catch (error) {
      return createErrorResponse(
        error,
        `Error fetching clusters: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
