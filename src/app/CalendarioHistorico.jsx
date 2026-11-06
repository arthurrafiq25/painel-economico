"use client";

import { useState, useEffect, useMemo } from "react";

// ✏️ PERSONALIZE AQUI ------------------------------------------------------
const MODO_GUIA = false; // true = mostra contornos tracejados nos espaços vazios; false = esconde
const TITULO_BLOG = "Calendário Histórico"; // título para leitores de tela (não aparece)
const TEXTO_SOBRE = "Vamos conhecer juntos a história do Brasil.";
const ROTULO_TODOS = "todos os anos";
const TITULO_SECAO = "ARTIGOS";
const MSG_VAZIO = "Nenhum artigo por aqui ainda.";
const N_ICONES_RODAPE = 6; // quantidade de espaços para ícones no rodapé
// cores dos cabeçalhos de cada década no menu (cicla se houver mais décadas)
const CORES_GRUPOS = ["#e9a46a", "#f1cc6e", "#b8cc8e", "#e7a9a2", "#c9b08e", "#d9b3d0"];
// -------------------------------------------------------------------------

// Só lê os campos do JSON (aceita alguns nomes alternativos); não altera os dados.
function normalizar(a, i) {
  return {
    id: a.id ?? `${a.ano ?? a.year ?? "x"}-${i}`,
    titulo: a.titulo ?? a.title ?? "",
    ano: a.ano ?? a.year ?? "",
    html: a.conteudo ?? a.conteudoHtml ?? a.html ?? "",
  };
}

/**
 * Blog "Calendário Histórico".
 *
 * ⚠️ SUA LÓGICA DE DADOS: mantenha aqui o que você já faz para carregar o JSON
 * (import, fetch/useEffect etc.). O layout só precisa receber uma lista:
 *   [{ titulo, ano, conteudo }, ...]   (conteudo = HTML)
 */

export default function CalendarioHistorico() {
  const [artigos, setArtigos] = useState([]);

  useEffect(() => {
    fetch("/artigos_historicos.json")
      .then((r) => r.json())
      .then((d) => setArtigos(d.artigos || []))
      .catch(() => {});
  }, []);

  return <BlogLayout artigos={artigos} />;
}

function BlogLayout({ artigos: entrada }) {
  const [anoSel, setAnoSel] = useState(null); // null = todos os anos

  const artigos = useMemo(
    () => (Array.isArray(entrada) ? entrada : []).map(normalizar),
    [entrada]
  );

  // Menu: anos (mais novo primeiro) agrupados por década, com contagem
  const grupos = useMemo(() => {
    const contagem = new Map();
    artigos.forEach((a) => {
      const k = String(a.ano);
      contagem.set(k, (contagem.get(k) ?? 0) + 1);
    });
    const anos = [...contagem.entries()].sort(
      (x, y) => Number(y[0]) - Number(x[0]) || y[0].localeCompare(x[0])
    );
    const porDecada = new Map();
    anos.forEach(([ano, n]) => {
      const num = Number(ano);
      const rotulo = Number.isFinite(num) && ano !== "" ? `anos ${Math.floor(num / 10) * 10}` : "outros";
      if (!porDecada.has(rotulo)) porDecada.set(rotulo, []);
      porDecada.get(rotulo).push({ ano, n });
    });
    return [...porDecada.entries()].map(([rotulo, itens]) => ({ rotulo, itens }));
  }, [artigos]);

  const lista = anoSel === null ? artigos : artigos.filter((a) => String(a.ano) === anoSel);

  return (
    <div className={`blog${MODO_GUIA ? " blog-modo-guia" : ""}`}>
      {/* Camada para textura/arte de fundo da página inteira */}
      <div className="espaco-textura-fundo" data-rotulo="TEXTURA DE FUNDO (página inteira)" aria-hidden="true" />

      {/* ===== TOPO: colagem gigante + título animado + faixa rolante ===== */}
      <header className="blog-topo">
        <h1 className="somente-leitor">{TITULO_BLOG}</h1>

        <div className="blog-topo-colagem">
          <div className="espaco-banner-topo" data-rotulo="BANNER / COLAGEM DO TOPO (ex.: 1000 x 320)" aria-hidden="true" />
          <div className="titulo-animado" data-rotulo="TÍTULO ANIMADO" aria-hidden="true" />
          <div className="espaco-figurinha espaco-figurinha-topo-esq" data-rotulo="FIGURINHA" aria-hidden="true" />
          <div className="espaco-figurinha espaco-figurinha-topo-dir" data-rotulo="FIGURINHA" aria-hidden="true" />
        </div>

        <div className="espaco-faixa-rolante">
          <img src="/faixa.png" alt="" className="faixa-img" />
          <img src="/faixa.png" alt="" className="faixa-img" />
          <img src="/faixa.png" alt="" className="faixa-img" />
          <img src="/faixa.png" alt="" className="faixa-img" />
          <img src="/faixa.png" alt="" className="faixa-img" />
        </div>
      </header>

      {/* ===== CORPO: menu lateral + posts ===== */}
      <div className="blog-corpo">
        <aside className="blog-lateral">
          <div className="blog-sobre">{TEXTO_SOBRE}</div>

          <nav className="blog-menu-caixa" aria-label="Anos">
            <button
              type="button"
              className="blog-menu-todos"
              aria-current={anoSel === null ? "true" : undefined}
              onClick={() => setAnoSel(null)}
            >
              {ROTULO_TODOS}
              <span className="blog-menu-n">({artigos.length})</span>
            </button>

            {grupos.map((g, gi) => (
              <div className="blog-menu-grupo" key={g.rotulo} style={{ "--cor": CORES_GRUPOS[gi % CORES_GRUPOS.length] }}>
                <div className="blog-menu-titulo">{g.rotulo}</div>
                <ul className="blog-menu-lista">
                  {g.itens.map(({ ano, n }) => (
                    <li key={ano}>
                      <button
                        type="button"
                        className="blog-menu-item"
                        aria-current={anoSel === ano ? "true" : undefined}
                        onClick={() => setAnoSel(ano)}
                      >
                        {ano}
                        <span className="blog-menu-n">({n})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="espaco-figurinha espaco-figurinha-menu" data-rotulo="FIGURINHA" aria-hidden="true" />
          </nav>

          <div className="espaco-gif-lateral" data-rotulo="GIF / FIGURINHA LATERAL" aria-hidden="true" />
        </aside>

        <main className="blog-principal">
          <h2 className="blog-secao-titulo">
            {TITULO_SECAO}
            {anoSel !== null && <span className="blog-secao-ano"> · {anoSel}</span>}
          </h2>

          {lista.length === 0 ? (
            <p className="blog-vazio">{MSG_VAZIO}</p>
          ) : (
            lista.map((a) => (
              <article className="blog-post" key={a.id}>
                <header className="blog-post-cabecalho">
                  <h3 className="blog-post-titulo">{a.titulo}</h3>
                  <span className="blog-post-ano">{a.ano}</span>
                </header>
                {/* O conteúdo vem do seu JSON (HTML). Se algum dia vier de usuários, sanitize antes. */}
                <div className="blog-post-conteudo" dangerouslySetInnerHTML={{ __html: a.html }} />
              </article>
            ))
          )}

          <div className="espaco-figurinha espaco-figurinha-principal-sup-dir" data-rotulo="FIGURINHA" aria-hidden="true" />
          <div className="espaco-figurinha espaco-figurinha-principal-inf-esq" data-rotulo="FIGURINHA" aria-hidden="true" />
        </main>
      </div>

      {/* ===== RODAPÉ: fileira de ícones/figurinhas ===== */}
      <footer className="espaco-icones-rodape" aria-hidden="true">
        {Array.from({ length: N_ICONES_RODAPE }, (_, i) => (
          <div className="espaco-icone-rodape" data-rotulo={`ÍCONE ${i + 1}`} key={i} />
        ))}
      </footer>
    </div>
  );
}