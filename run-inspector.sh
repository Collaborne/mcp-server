#!/bin/bash

# Run MCP Inspector for NEXT MCP Server
# This script launches the MCP Inspector connected to our NEXT MCP server

# Check if .env file exists
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Please create one based on .env.sample."
  echo "Make sure to fill in your NEXT API_KEY."
  exit 1
fi

# Check if NEXT MCP server is built
if [ ! -d dist ]; then
  echo "Building NEXT MCP server..."
  npm run build
fi

# Launch the MCP Inspector
echo "Launching MCP Inspector with NEXT MCP server..."
echo "This will open in your browser. If it doesn't, check the terminal output for a URL to open."
echo ""

npx @modelcontextprotocol/inspector node ./dist/index.js

# Exit gracefully
exit 0
