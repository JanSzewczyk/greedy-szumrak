/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");

const { env } = require("./env");

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins([withBundleAnalyzer({ enabled: env.ANALYZE })], {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: true,
    instrumentationHook: true,
    serverComponentsExternalPackages: ["@szum-tech/design-system"]
  },
  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" }
    ];
  }
});

module.exports = nextConfig;
