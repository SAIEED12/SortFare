// lib/ai/mcp.js
//
// FL-07: MCP client factory for the Fetch MCP server.
//
// Spawns the @modelcontextprotocol/server-fetch package as a stdio
// subprocess. The server exposes a single `fetch` tool that retrieves
// any URL and returns clean, readable content — no API key required.
//
// Usage (server-side only, inside /api/chat route handler):
//   const mcpClient = await createFetchMCP()
//   const mcpTools = await mcpClient.tools()
//   // ... pass mcpTools to streamText ...
//   await mcpClient.close()
import { createMCPClient } from '@ai-sdk/mcp'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

export async function createFetchMCP() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-fetch'],
  })

  return createMCPClient({ transport })
}
