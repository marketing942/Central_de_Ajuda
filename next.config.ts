import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // Standalone só para a imagem Docker (Portainer). Na Vercel ele quebra o
  // build ("next-server.js.nft.json" ausente) e não é necessário.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  // O antigo endereço confirma.cppem.com.br (agora parte da Central): a raiz mostra a página /confirma.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "confirma.cppem.com.br" }],
          destination: "/confirma",
        },
      ],
    };
  },
  // Páginas que saíram dos Extras: quem tiver o endereço antigo cai na lista de extras.
  async redirects() {
    return [
      { source: "/extras/financas", destination: "/extras", permanent: true },
      { source: "/extras/metas", destination: "/extras", permanent: true },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
