import { createErrorResponse } from "../helpers/createErrorResponse.js";
import { ApiClient } from "../resources/apiClient.js";

import type { IMCPTool, MinimalHighlight, MinimalTag } from "../types.js";
import { buildHighlightsResponse } from "../utils/build-highlights-response.js";
import z from "zod";
import { DateFilter, toDateSearch, toTagSearch } from "../utils/filters.js";
import { isExisting } from "../utils/is-existing.js";

export class GetHighlightsTool implements IMCPTool {
  readonly name = "next-get-highlights";

  readonly description =
    "Used to fetch highlights: insight nuggets from User Interviews, Sales Calls, etc. Best used for specific details about a topic";

  readonly parameters = {
    dateFilter: z
      .string()
      .describe(
        `MUST be exactly one of these options ${Object.values(DateFilter)}`
      )
      .describe(
        `time filter in the user question MUST be on of these options ${Object.values(
          DateFilter
        )}`
      ),
    tagFilters: z
      .array(z.string().describe('unique identifiers of tag filters or empty array'))
      .describe(
        "An array of unique identifiers of tag filters to apply in the search, you MUST use only tags provided, do not make up tags, use a maximum of two tags, must be empty if no tags are provided"
      ),
  };

  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async execute(args: { dateFilter: DateFilter; tagFilters?: string[] }) {
    try {
      const tagIds = args?.tagFilters ?? [];

      const filterParts = [
        toDateSearch(args?.dateFilter ?? DateFilter.forever),
        toTagSearch(tagIds ?? []),
      ];

      const searchTerm = filterParts.filter(isExisting).join(" ");
      process.stderr.write(searchTerm);

      const highlights = await this.apiClient.getHighlights<MinimalHighlight>({
        search_term: searchTerm,
      });
      const highlightsStr = buildHighlightsResponse(highlights);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(highlightsStr, null, 2),
          },
        ],
      };
    } catch (error) {
      return createErrorResponse(
        error,
        `Error fetching highlights: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
