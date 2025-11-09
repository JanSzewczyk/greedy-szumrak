# MCP Usage Examples for Greedy Szumrak

Real-world examples of how to use MCP servers in this Next.js + Firebase + Clerk project.

## ⚡ Next.js Integration

### Analyze App Router Structure

```bash
# Ask Claude:
"Using Next.js MCP, analyze the App Router structure and show all routes"

# Or:
"What routes are defined in the app/ directory?"
```

### Validate Route Configuration

```bash
# Ask Claude:
"Check if all onboarding routes are properly configured"

# Or:
"Validate the API route structure in app/api/"
```

### Build Analysis

```bash
# Ask Claude:
"Analyze the Next.js build output and identify large bundles"

# Or:
"Check for unused pages or routes in the build"
```

### Performance Insights

```bash
# Ask Claude:
"Show me which routes are using Server Components vs Client Components"

# Or:
"Analyze the app/onboarding routes for potential performance issues"
```

### Config Validation

```bash
# Ask Claude:
"Validate next.config.ts and check for deprecated options"

# Or:
"Show me the current Turbopack configuration"
```

## 🔥 Firebase Integration

### Query Firestore Collections

```typescript
// Ask Claude:
"Using the Firebase MCP, show me all documents in the 'onboarding' collection";

// Or more specific:
"Query the 'budget-templates' collection where isPredefined = true";
```

### Check Database State

```typescript
// Ask Claude:
"What's the current onboarding status for user ID: user_xyz123?";

// Or during debugging:
"Show me all budget templates in Firestore and verify the seeding worked correctly";
```

## 🎭 Playwright Testing

### Run E2E Tests

```bash
# Ask Claude:
"Run the Playwright E2E tests using MCP"

# Debug specific test:
"Run the onboarding flow test and show me the results"

# Check test coverage:
"Show me all E2E test files and their status"
```

### Debug Test Failures

```bash
# Ask Claude:
"The authentication test is failing. Can you run it and analyze the error?"

# Or:
"Run the E2E tests in headed mode and capture screenshots of failures"
```

## 🐙 GitHub Integration

### Create Pull Request

```bash
# Ask Claude:
"I've finished implementing the budget feature. Create a PR using the GitHub MCP"

# With context:
"Create a PR for the onboarding-improvements branch, including all commits since main"
```

### Check PR Status

```bash
# Ask Claude:
"What's the status of PR #42? Are there any failing checks?"

# Or:
"List all open PRs related to Firebase integration"
```

### Review Code Changes

```bash
# Ask Claude:
"Show me the diff for the last commit and review it for security issues"

# Or:
"Compare the current branch with main and summarize the changes"
```

## 📁 Filesystem Operations

### Search Codebase

```bash
# Ask Claude:
"Find all files that use Firebase Timestamp"

# Or:
"Show me all server actions in the features directory"

# Or:
"List all Clerk authentication middleware files"
```

### Analyze Project Structure

```bash
# Ask Claude:
"Show me the structure of the features/onboarding directory"

# Or:
"List all components that use the design system's Button component"
```

## 🧠 Memory (Persistent Context)

### Store Project Knowledge

```bash
# Tell Claude:
"Remember that the onboarding flow has 4 steps: Welcome, Preferences, Goals, Categories"

# Or:
"Save this context: Budget templates are auto-seeded on app startup via lib/firebase/auto-seed.ts"
```

### Retrieve Saved Context

```bash
# Ask Claude:
"What did we discuss about the onboarding flow?"

# Or:
"Remind me how Firebase seeding works in this project"
```

## 🔄 Combined Workflows

### Feature Development Flow

```bash
# 1. Analyze routing structure
"Using Next.js MCP, show me the onboarding routes structure"

# 2. Search for existing implementation
"Using filesystem MCP, find similar form components in the codebase"

# 3. Implement the feature
[... implement code ...]

# 4. Run tests
"Run unit tests for the new component using Playwright MCP"

# 5. Create PR
"Create a PR with the GitHub MCP, including test results in the description"
```

### Next.js Route Development

```bash
# 1. Analyze existing routes
"Use Next.js MCP to show all app/ routes and their types (page, layout, route)"

# 2. Check for similar patterns
"Find all Server Actions in the codebase using filesystem MCP"

# 3. Implement new route
[... implement route ...]

# 4. Validate routing
"Use Next.js MCP to validate the new route is properly configured"

# 5. Test
"Run E2E tests for the new route using Playwright MCP"
```

### Debugging Production Issues

```bash
# 1. Check database state
"Query Firebase for the problematic user's onboarding data"

# 2. Review recent changes
"Show me recent commits affecting the onboarding flow"

# 3. Run tests
"Run E2E tests for the onboarding flow to reproduce the issue"

# 4. Check logs
"Search for error logs in the codebase related to Firebase transactions"
```

### Code Review Workflow

```bash
# 1. Get PR details
"Fetch PR #123 details using GitHub MCP"

# 2. Review files
"Show me the changed files and analyze for potential issues"

# 3. Run tests
"Run the test suite for the affected components"

# 4. Leave review
"Create a review comment on GitHub suggesting improvements"
```

## 💡 Pro Tips

### Combine Multiple MCP Servers

```bash
# Example 1: Test + Database
"Run the E2E tests (Playwright MCP), then query Firebase to verify the test data was created correctly"

# Example 2: Code Search + GitHub
"Find all TODOs in the codebase (filesystem MCP), then create a GitHub issue listing them"

# Example 3: Full Stack Verification
"1. Query Firebase for budget templates
 2. Run E2E tests for the budget feature
 3. Create a PR if tests pass
 4. Save this workflow to memory for next time"
```

### Context-Aware Queries

```bash
# Instead of:
"Show me the file src/features/onboarding/server/db/onboarding.ts"

# Use MCP context:
"Using the filesystem MCP, show me the onboarding database queries and explain the error handling pattern used"
```

### Debugging with Full Context

```bash
# Comprehensive debugging:
"1. Show me the Firebase seeding logs (filesystem MCP)
 2. Query the budget-templates collection (Firebase MCP)
 3. Run the seeding test (Playwright MCP)
 4. Compare with the predefined templates in the code"
```

## 🚨 Common Issues & Solutions

### Issue: Firebase MCP not connecting

```bash
# Solution 1: Check credentials
"Verify that FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .mcp/.env"

# Solution 2: Test manually
firebase projects:list
```

### Issue: Playwright tests not found

```bash
# Solution: Check test directory
"List all files in tests/e2e/ using filesystem MCP"

# Verify config
"Show me the playwright.config.ts file"
```

### Issue: GitHub MCP authentication failed

```bash
# Solution: Refresh token
"Check if GITHUB_TOKEN in .mcp/.env is valid and has the required scopes (repo, read:org)"

# Test manually
gh auth status
```

## 📚 Learning Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [GitHub CLI](https://cli.github.com/manual/)

## 🎯 Next Steps

After setting up MCP, try:

1. **Explore the codebase**: "Using filesystem MCP, give me a tour of the project structure"
2. **Verify database**: "Query Firebase to show me all collections and their document counts"
3. **Run tests**: "Execute all Playwright tests and summarize the results"
4. **Create a workflow**: "Help me set up a custom workflow combining these MCP servers"

---

Need help? Check `.mcp/README.md` or ask Claude to help you configure MCP servers.
