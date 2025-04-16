import type { z } from "zod";

/**
 * Helper type to infer the parameter types from Zod schemas
 */
export type InferZodParams<T extends Record<string, z.ZodType>> = {
  [K in keyof T]: z.infer<T[K]>;
};

/**
 * Interface for MCP tools
 */
export interface IMCPTool<
  TParams extends Record<string, z.ZodType> = Record<string, z.ZodType>
> {
  /**
   * Tool name
   */
  readonly name: string;

  /**
   * Tool description
   */
  readonly description: string;

  /**
   * Parameter definitions
   */
  readonly parameters: TParams;

  /**
   * Execute the tool
   * @param args Parameters
   */
  execute(args: InferZodParams<TParams>): Promise<{
    content: {
      type: "text";
      text: string;
      [key: string]: any;
    }[];
    isError?: boolean;
    [key: string]: any;
  }>;
}

export type MinimalHighlight = {
  id: string;
  interpretation_plain?: string;
  text: string;
};

export type MinimalPlaylist = {
  id: string;
  title?: string;
  description?: string;
  nr_linked_highlights?: number;
  highlight_ids?: string[];
  labels?: string[];
};
