import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/server-only packages must not be bundled by Turbopack.
  serverExternalPackages: ["better-sqlite3", "pg"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
