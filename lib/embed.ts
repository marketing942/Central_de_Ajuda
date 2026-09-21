// Converte o link colado no Notion (bloco /video ou /embed) em algo que o
// popup consegue exibir. Só viram <iframe> os provedores conhecidos abaixo;
// qualquer outro domínio é exibido como botão "Abrir link", para que ninguém
// consiga embutir uma página arbitrária na central.

export type Embed =
  | { kind: "iframe"; src: string; provider: string; aspect: "video" | "document" }
  | { kind: "file"; src: string }
  | { kind: "link"; href: string };

const VIDEO_FILE = /\.(mp4|webm|mov|m4v)$/i;

function parse(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** "90", "90s", "1m30s", "1h2m3s" → segundos */
function parseStart(value: string | null): number {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

function youtube(url: URL): string | null {
  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;

  if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/);
      id = match?.[1] ?? null;
    }
  } else return null;

  if (!id || !/^[\w-]{6,}$/.test(id)) return null;
  const start = parseStart(url.searchParams.get("t") ?? url.searchParams.get("start"));
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (start > 0) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

function vimeo(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "player.vimeo.com") return url.pathname.startsWith("/video/") ? url.href : null;
  if (host !== "vimeo.com") return null;
  const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  if (!match) return null;
  const hash = match[2] ?? url.searchParams.get("h");
  return `https://player.vimeo.com/video/${match[1]}${hash ? `?h=${hash}` : ""}`;
}

function loom(url: URL): string | null {
  if (url.hostname.replace(/^www\./, "") !== "loom.com") return null;
  const match = url.pathname.match(/^\/(?:share|embed)\/([\da-f]+)/i);
  return match ? `https://www.loom.com/embed/${match[1]}` : null;
}

function googleDrive(url: URL): string | null {
  if (url.hostname !== "drive.google.com") return null;
  const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get("id");
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

function googleDocs(url: URL): string | null {
  if (url.hostname !== "docs.google.com") return null;
  const match = url.pathname.match(/^\/(document|spreadsheets|presentation|forms)\/d\/(e\/)?([^/]+)/);
  if (!match) return null;
  const [, kind, published, id] = match;
  const base = `https://docs.google.com/${kind}/d/${published ?? ""}${id}`;
  if (kind === "presentation") return `${base}/embed`;
  if (kind === "forms") return `${base}/viewform?embedded=true`;
  return `${base}/preview`;
}

function pandaVideo(url: URL): string | null {
  return url.hostname.endsWith(".pandavideo.com.br") && url.pathname.startsWith("/embed") ? url.href : null;
}

function canva(url: URL): string | null {
  if (url.hostname.replace(/^www\./, "") !== "canva.com" || !url.pathname.startsWith("/design/")) return null;
  const embed = new URL(url.href);
  embed.pathname = embed.pathname.replace(/\/(edit|view)\/?$/, "/view");
  embed.search = "?embed";
  return embed.href;
}

const providers: Array<{ name: string; aspect: "video" | "document"; resolve: (url: URL) => string | null }> = [
  { name: "YouTube", aspect: "video", resolve: youtube },
  { name: "Vimeo", aspect: "video", resolve: vimeo },
  { name: "Loom", aspect: "video", resolve: loom },
  { name: "Panda Video", aspect: "video", resolve: pandaVideo },
  { name: "Google Drive", aspect: "video", resolve: googleDrive },
  { name: "Google Docs", aspect: "document", resolve: googleDocs },
  { name: "Canva", aspect: "document", resolve: canva },
];

export function resolveEmbed(raw: string): Embed | null {
  const url = parse(raw);
  if (!url) return null;

  for (const provider of providers) {
    const src = provider.resolve(url);
    if (src) return { kind: "iframe", src, provider: provider.name, aspect: provider.aspect };
  }

  if (VIDEO_FILE.test(url.pathname)) return { kind: "file", src: url.href };
  return { kind: "link", href: url.href };
}
