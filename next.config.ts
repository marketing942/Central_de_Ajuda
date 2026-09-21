import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // Standalone só para a imagem Docker (Portainer). Na Vercel ele quebra o
  // build ("next-server.js.nft.json" ausente) e não é necessário.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
