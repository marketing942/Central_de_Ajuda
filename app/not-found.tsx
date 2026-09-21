import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <span className="eyebrow">Página não encontrada</span>
        <h1 className="section-title">Este conteúdo não está disponível</h1>
        <p className="section-copy">O artigo pode ter sido atualizado ou mudado de categoria.</p>
        <Link className="gold-button" href="/">Ir para a Central de Ajuda</Link>
      </div>
    </section>
  );
}
