#!/bin/bash

# MCP Setup Script for greedy-szumrak
# This script helps you configure MCP servers for Claude Code

set -e

echo "🚀 MCP Setup for greedy-szumrak"
echo "================================"
echo ""

# Check if .env exists
if [ -f ".mcp/.env" ]; then
    echo "✅ .mcp/.env already exists"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Skipping .env creation"
    else
        cp .mcp/.env.example .mcp/.env
        echo "✅ Created .mcp/.env from template"
    fi
else
    cp .mcp/.env.example .mcp/.env
    echo "✅ Created .mcp/.env from template"
fi

echo ""
echo "📝 Configuration Steps:"
echo ""

# GitHub Token
echo "1. GitHub Integration (optional)"
echo "   - Get token: https://github.com/settings/tokens"
echo "   - Required scopes: repo, read:org"
read -p "   Do you have a GitHub token? (y/N): " has_github
if [ "$has_github" = "y" ] || [ "$has_github" = "Y" ]; then
    read -p "   Enter your GitHub token: " github_token
    if [ -n "$github_token" ]; then
        # Update .env file
        if grep -q "^GITHUB_TOKEN=" .mcp/.env; then
            sed -i.bak "s|^GITHUB_TOKEN=.*|GITHUB_TOKEN=$github_token|" .mcp/.env && rm .mcp/.env.bak
        else
            echo "GITHUB_TOKEN=$github_token" >> .mcp/.env
        fi
        echo "   ✅ GitHub token saved"
    fi
fi

echo ""
echo "2. Firebase Integration"
echo "   Firebase credentials will be read from root .env.local"

# Check if .env.local exists in root
if [ -f "../.env.local" ] || [ -f ".env.local" ]; then
    echo "   ✅ .env.local found - Firebase should work automatically"
else
    echo "   ⚠️  No .env.local found in project root"
    echo "   Make sure to add Firebase credentials to .env.local"
fi

echo ""
echo "3. Playwright Integration"
echo "   Installing Playwright browsers..."
npx playwright install chromium --with-deps || echo "   ⚠️  Playwright install failed (you may need to run this manually)"

echo ""
echo "✅ MCP Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "   1. Review .mcp/.env and add any missing credentials"
echo "   2. Start Claude Code: claude"
echo "   3. Check available MCP tools with: @mcp"
echo ""
echo "📖 Documentation: .mcp/README.md"
echo ""
