import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "vantage-cue-demo";
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static files and publishes project sites below /<repository>.
  ...(isGitHubPages && {
    output: "export",
    trailingSlash: true,
    basePath,
    assetPrefix: basePath,
    images: { unoptimized: true },
  }),
  // Prevent Next.js dev mode from generating AI-instruction files in the project root.
  agentRules: false,
};
export default nextConfig;
