#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { ApiClient } from "./resources/apiClient";
import { createTools } from "./tools";

// Process command-line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
next-mcp-server - NEXT Model Context Protocol Server

Usage:
  next-mcp-server [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version information

Environment Variables:
  API_KEY            API key of your next team-space

For more information, visit: https://developer.nextapp.co/#/
  `);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  process.stderr.write("next-mcp-server v0.1.0");
  process.exit(0);
}

// Load environment variables from .env file if it exists
dotenv.config();

const server = new McpServer(
  {
    name: "next-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      prompts: {},
    },
  }
);

const apiClient = new ApiClient({
  apiKey: `Token ${process.env.API_KEY}`,
});

// Create and register all tools
const tools = createTools(apiClient);
for (const tool of tools) {
  server.tool(
    tool.name,
    tool.description,
    tool.parameters,
    tool.execute.bind(tool)
  );
}

async function main() {
  const transport = new StdioServerTransport();

  process.stderr.write("NEXT MCP Server starting...");

  try {
    await server.connect(transport);
    process.stderr.write("NEXT MCP Server running");
  } catch (error) {
    console.error("Failed to start NEXT server:", error);
    process.exit(1);
  }
}

main();
