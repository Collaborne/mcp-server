import { ApiClient } from "../resources/apiClient";
import type { IMCPTool } from "../types.js";
import { GetClustersTool } from "./get-clusters";
import { GetHighlightsTool } from "./get-highlights";
import { GetTagsTool } from "./get-tags";

/**
 * Create all tool instances
 * @param apiClient S3Resource instance to be used by all tools
 * @returns Array of all tools
 */
export function createTools(apiClient: ApiClient): IMCPTool[] {
  return [
    new GetTagsTool(apiClient),
    new GetHighlightsTool(apiClient),
    new GetClustersTool(apiClient),
  ];
}

// Export all tool classes
export { GetClustersTool, GetHighlightsTool };
