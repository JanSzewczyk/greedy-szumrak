# MCP (Model Context Protocol) Configuration

This directory contains MCP server configuration for Claude Code integration.

## Available MCP Servers

### 1. **filesystem**
- **Purpose**: Direct file system access for project exploration
- **Usage**: Browse project structure, read files, search codebase
- **No setup required**

### 2. **github**
- **Purpose**: GitHub integration (PRs, issues, commits)
- **Setup**: Set `GITHUB_TOKEN` environment variable
  ```bash
  export GITHUB_TOKEN="your_github_personal_access_token"
  ```
- **Get token**: https://github.com/settings/tokens

### 3. **playwright**
- **Purpose**: Run and debug Playwright E2E tests
- **Usage**: Execute tests, get test results, debug failures
- **No setup required** (uses existing playwright.config.ts)

### 4. **firebase**
- **Purpose**: Firestore database queries and management
- **Setup**: Uses same Firebase credentials as the app
  - Automatically reads from `.env.local` if available
  - Or set environment variables:
    ```bash
    export FIREBASE_PROJECT_ID="your-project-id"
    export FIREBASE_CLIENT_EMAIL="your-client-email"
    export FIREBASE_PRIVATE_KEY="your-private-key"
    ```

### 5. **memory**
- **Purpose**: Persistent memory across Claude sessions
- **Usage**: Store context, preferences, project-specific knowledge
- **No setup required**

### 6. **nextjs**
- **Purpose**: Next.js integration for routing, build analysis, and config management
- **Usage**: Analyze routes, check build output, validate Next.js config
- **Features**:
  - App Router analysis (14 routes)
  - Route inspection and validation
  - Build output analysis with Turbopack
  - Config file validation (next.config.ts)
  - Performance insights
  - Next.js 16 compatibility checking
  - Migration assistance
- **No setup required** (uses existing next.config.ts)
- **Current Version**: Next.js 16.0.1 with Turbopack stable

## How to Use

### In Claude Code CLI

MCP servers are automatically loaded when you start Claude Code in this directory:

```bash
cd /Users/janszewczyk/Projects/greedy-szumrak
claude
```

### In Claude Desktop App

Copy the MCP configuration to Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "greedy-szumrak-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/janszewczyk/Projects/greedy-szumrak"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
    // ... add other servers as needed
  }
}
```

## Additional MCP Servers to Consider

### Development Tools
- **@modelcontextprotocol/server-postgres** - If you add PostgreSQL later
- **@modelcontextprotocol/server-redis** - For caching layer
- **@modelcontextprotocol/server-docker** - Docker container management

### Testing & Quality
- **@modelcontextprotocol/server-sentry** - Error monitoring integration
- **@modelcontextprotocol/server-lighthouse** - Performance audits

### Productivity
- **@modelcontextprotocol/server-slack** - Team notifications
- **@modelcontextprotocol/server-linear** - Project management

## Environment Variables

Create a `.mcp/.env` file for MCP-specific environment variables:

```bash
# GitHub
GITHUB_TOKEN=ghp_your_token_here

# Firebase (optional, reads from root .env.local)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Troubleshooting

### MCP server not starting
- Check that Node.js is installed: `node --version`
- Verify npx is available: `npx --version`
- Check environment variables are set correctly

### Firebase connection issues
- Verify credentials in `.env.local` are correct
- Ensure service account has Firestore access
- Check project ID matches your Firebase project

### Playwright tests not running
- Install Playwright browsers: `npx playwright install`
- Verify `playwright.config.ts` exists
- Check tests are in `tests/e2e/` directory

### Next.js MCP issues
- Verify Next.js 16.0.1 is installed: `npm list next`
- Check `next.config.ts` exists and is valid
- Ensure Turbopack is configured properly
- Verify `proxy.ts` exists (Next.js 16 convention, formerly `middleware.ts`)

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Claude Code Docs](https://docs.claude.com/claude-code)