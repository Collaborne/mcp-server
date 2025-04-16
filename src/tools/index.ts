import { ApiClient } from "../resources/apiClient.js";
import type { IMCPTool } from "../types.js";
import { GetClustersTool } from "./get-clusters.js";
import { GetHighlightsTool } from "./get-highlights.js";

/**
 * Create all tool instances
 * @param apiClient S3Resource instance to be used by all tools
 * @returns Array of all tools
 */
export function createTools(apiClient: ApiClient): IMCPTool[] {
  return [new GetHighlightsTool(apiClient), new GetClustersTool(apiClient)];
}

// Export all tool classes
export { GetClustersTool, GetHighlightsTool };
