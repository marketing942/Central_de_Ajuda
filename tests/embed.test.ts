import { describe, expect, it } from "vitest";
import { resolveEmbed } from "@/lib/embed";

describe("resolveEmbed", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"],
    ["https://youtu.be/dQw4w9WgXcQ?t=90", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&start=90"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&start=90"],
    ["https://youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"],
    ["https://vimeo.com/123456789/abcdef1234", "https://player.vimeo.com/video/123456789?h=abcdef1234"],
    ["https://www.loom.com/share/0123456789abcdef", "https://www.loom.com/embed/0123456789abcdef"],
    ["https://drive.google.com/file/d/FILE_ID/view?usp=sharing", "https://drive.google.com/file/d/FILE_ID/preview"],
    ["https://docs.google.com/presentation/d/DECK_ID/edit#slide=id.p", "https://docs.google.com/presentation/d/DECK_ID/embed"],
  ])("converte %s em player", (input, src) => {
    expect(resolveEmbed(input)).toMatchObject({ kind: "iframe", src });
  });

  it("aceita embed do Panda Video como está", () => {
    const url = "https://player-vz-abc123.tv.pandavideo.com.br/embed/?v=uuid";
    expect(resolveEmbed(url)).toMatchObject({ kind: "iframe", src: url, provider: "Panda Video" });
  });

  it("toca arquivo de vídeo enviado direto ao Notion", () => {
    const url = "https://prod-files-secure.s3.us-west-2.amazonaws.com/x/y/aula.mp4?X-Amz-Signature=abc";
    expect(resolveEmbed(url)).toEqual({ kind: "file", src: url });
  });

  it("não embute domínio desconhecido em iframe", () => {
    expect(resolveEmbed("https://exemplo.com/pagina")).toEqual({ kind: "link", href: "https://exemplo.com/pagina" });
  });

  it("ignora links sem https", () => {
    expect(resolveEmbed("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(resolveEmbed("javascript:alert(1)")).toBeNull();
  });
});
