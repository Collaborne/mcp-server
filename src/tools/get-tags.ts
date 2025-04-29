import { createErrorResponse } from "../helpers/createErrorResponse";
import { ApiClient } from "../resources/apiClient";

import type { IMCPTool, MinimalTag } from "../types";
import { buildTagsResponse } from "../utils/build-tags-response";

export class GetTagsTool implements IMCPTool {
  readonly name = "next-get-tags";

  readonly description =
    "Used to fetch tags: Tags are used to categorize insights/highlights, and help in organizing and filtering data";

  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async execute() {
    try {
      const tags = await this.apiClient.getTags<MinimalTag>();
      const tagsStr = buildTagsResponse(tags);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(tagsStr, null, 2),
          },
        ],
      };
    } catch (error) {
      return createErrorResponse(
        error,
        `Error fetching tags: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
