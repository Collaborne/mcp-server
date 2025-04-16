import { createErrorResponse } from "../helpers/createErrorResponse.js";
import { ApiClient } from "../resources/apiClient.js";

import type { IMCPTool, MinimalHighlight } from "../types.js";
import { buildHighlightsResponse } from "../utils/build-highlights-response.js";
import z from "zod";
import {
  DateFilter,
  toDateSearch,
  toTypeSearch,
  TypeFilter,
} from "../utils/filters.js";
import { isExisting } from "../utils/is-existing.js";

export class GetHighlightsTool implements IMCPTool {
  readonly name = "get-highlights";

  readonly description =
    "Used to fetch insight nuggets from User Interviews, Sales Calls, etc. Best used for specific details about a topic";

  readonly parameters = {
    searchFilters: z
      .object({
        dateFilter: z
          .nativeEnum(DateFilter)
          .default(DateFilter.forever)
          .describe("time filter in the user question"),
        typeFilters: z
          .array(z.nativeEnum(TypeFilter))
          .optional()
          .describe("type filters in the user question"),
      })
      .optional()
      .describe("Used to search for specific highlights"),
  } as const;

  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async execute(args: {
    searchFilters?: {
      dateFilter: DateFilter;
      typeFilters: TypeFilter[];
    };
  }) {
    try {
      const filterParts = [
        toDateSearch(args.searchFilters?.dateFilter ?? DateFilter.forever),
        toTypeSearch(args.searchFilters?.typeFilters ?? []),
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
