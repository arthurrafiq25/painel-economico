"use client";

import { useEffect, useState } from "react";

// ✏️ PERSONALIZE AQUI ------------------------------------------------------
const TITULO = "FONTES PÚBLICAS";
const ROTULO_PASTA = "LINKS"; // texto ao lado do ícone de pasta
const ROTULO_UNIDADE = "WEB"; // texto ao lado do ícone de disco

// Lista de links (EXEMPLOS: confira e edite). Cada item: { rotulo, href }
const LINKS_PADRAO = [
  { rotulo: "IBGE", href: "https://www.ibge.gov.br" },
  { rotulo: "Banco Central", href: "https://www.bcb.gov.br" },
  { rotulo: "Agência Brasil", href: "https://agenciabrasil.ebc.com.br" },
  { rotulo: "Tesouro Transparente", href: "https://www.tesourotransparente.gov.br" },
  { rotulo: "Ministério do Trabalho", href: "https://www.gov.br/trabalho-e-emprego" },
];
// -------------------------------------------------------------------------

/**
 * Modal estilo Apple II (diálogo "Run a Program..." do DeskTop).
 *
 * Props:
 *   onClose  função chamada ao fechar (botão FECHAR ou tecla ESC)
 *   links    opcional: substitui LINKS_PADRAO ([{ rotulo, href }, ...])
 *
 * Uso:  {aberto && <ModalApple onClose={() => setAberto(false)} />}
 *
 * Interação: clique seleciona um link; "Abrir" (ou duplo clique) abre em nova aba.
 */
export default function ModalApple({ onClose, links = LINKS_PADRAO }) {
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  const abrir = (i) => {
    const l = links[i];
    if (l && l.href) window.open(l.href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="ap2-fundo">
      <div
        className="ap2-janela"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ap2-titulo"
      >
        <h2 id="ap2-titulo" className="ap2-titulo">
          {TITULO}
        </h2>

        <div className="ap2-caminho">
          <span className="ap2-caminho-item">
            <IconePasta /> {ROTULO_PASTA}
          </span>
          <span className="ap2-caminho-item">
            <IconeDisco /> {ROTULO_UNIDADE}
          </span>
        </div>

        <div className="ap2-corpo">
          <ul className="ap2-lista" aria-label={TITULO}>
            {links.map((l, i) => (
              <li key={l.href || l.rotulo || i}>
                <button
                  type="button"
                  className="ap2-item"
                  aria-pressed={sel === i}
                  title={l.href}
                  onClick={() => setSel(i)}
                  onDoubleClick={() => abrir(i)}
                >
                  <IconeArquivo />
                  <span className="ap2-item-nome">{l.rotulo}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="ap2-botoes">
            <button
              type="button"
              className="ap2-botao"
              disabled={sel === null}
              onClick={() => sel !== null && abrir(sel)}
            >
              Abrir
            </button>
            <button
              type="button"
              className="ap2-botao"
              disabled={sel === null}
              onClick={() => setSel(null)}
            >
              Limpar
            </button>
            <hr className="ap2-separador" />
            <button type="button" className="ap2-botao" onClick={onClose} autoFocus>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Ícones em pixel art simples (herdam a cor do texto) */
function IconePasta() {
  return (
    <svg className="ap2-icone" width="16" height="13" viewBox="0 0 16 13" aria-hidden="true" shapeRendering="crispEdges">
      <path d="M0.5 2.5h5l1.5 1.5h8.5v8h-15z" fill="none" stroke="currentColor" />
      <path d="M0.5 5.5h15" stroke="currentColor" />
    </svg>
  );
}

function IconeArquivo() {
  return (
    <svg className="ap2-icone" width="13" height="16" viewBox="0 0 13 16" aria-hidden="true" shapeRendering="crispEdges">
      <path d="M0.5 0.5h8l4 4v11h-12z" fill="none" stroke="currentColor" />
      <path d="M8.5 0.5v4h4" fill="none" stroke="currentColor" />
    </svg>
  );
}

function IconeDisco() {
  return (
    <svg className="ap2-icone" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="0.5" y="0.5" width="17" height="9" fill="none" stroke="currentColor" />
      <rect x="11" y="6" width="5" height="2" fill="currentColor" />
    </svg>
  );
}