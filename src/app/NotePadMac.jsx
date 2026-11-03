"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Visual de "Note Pad" do Mac clássico (estilo Platinum).
 * Só cuida da APARÊNCIA: o conteúdo e a lógica continuam sendo os seus.
 *
 * Props:
 *   children            o que aparece na folha (texto, <NotePadMacTexto />, etc.)
 *   pagina              número mostrado no rodapé (padrão 1; use null para esconder)
 *   onPaginaAnterior    opcional: clique na dobra do canto esquerdo
 *   onProximaPagina     opcional: clique na dobra do canto direito (só aparece se existir)
 */
export default function NotePadMac({
  children,
  pagina = 1,
  onPaginaAnterior,
  onProximaPagina,
}) {
  const papelRef = useRef(null);
  const conteudoRef = useRef(null);
  const trilhaRef = useRef(null);
  const [barra, setBarra] = useState({ visivel: false, topo: 0, altura: 0 });

  // Sincroniza o "polegar" da barra de rolagem com a rolagem real da folha
  const atualizar = useCallback(() => {
    const el = papelRef.current;
    const trilha = trilhaRef.current;
    if (!el || !trilha) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setBarra((b) => (b.visivel ? { visivel: false, topo: 0, altura: 0 } : b));
      return;
    }
    const alturaTrilha = trilha.clientHeight;
    const altura = Math.max(18, (clientHeight / scrollHeight) * alturaTrilha);
    const topo =
      (scrollTop / (scrollHeight - clientHeight)) * (alturaTrilha - altura);
    setBarra({ visivel: true, topo, altura });
  }, []);

  useEffect(() => {
    atualizar();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(atualizar);
    if (papelRef.current) ro.observe(papelRef.current);
    if (conteudoRef.current) ro.observe(conteudoRef.current);
    return () => ro.disconnect();
  }, [atualizar]);

  const rolarPor = (dy) => papelRef.current?.scrollBy({ top: dy });

  // Arrastar o polegar
  const arrastar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = papelRef.current;
    const trilha = trilhaRef.current;
    if (!el || !trilha) return;
    const y0 = e.clientY;
    const scroll0 = el.scrollTop;
    const { scrollHeight, clientHeight } = el;
    const alturaTrilha = trilha.clientHeight;
    const altura = Math.max(18, (clientHeight / scrollHeight) * alturaTrilha);
    const razao = (scrollHeight - clientHeight) / (alturaTrilha - altura);
    const mover = (ev) => {
      el.scrollTop = scroll0 + (ev.clientY - y0) * razao;
    };
    const soltar = () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
  };

  // Clicar na trilha (fora do polegar) rola uma "página"
  const cliqueTrilha = (e) => {
    const el = papelRef.current;
    if (!el || !barra.visivel) return;
    const rect = trilhaRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    el.scrollBy({ top: (y < barra.topo ? -1 : 1) * el.clientHeight * 0.9 });
  };

  return (
    <div className="npm-janela">
      <div className="npm-corpo">
        <div className="npm-papel" ref={papelRef} onScroll={atualizar} tabIndex={0}>
          <div className="npm-conteudo" ref={conteudoRef}>
            {children}
          </div>
        </div>

        <div className="npm-rodape">
          {onPaginaAnterior ? (
            <button
              type="button"
              className="npm-dobra npm-dobra-esq"
              onClick={onPaginaAnterior}
              title="Página anterior"
              aria-label="Página anterior"
            >
              <Dobra />
            </button>
          ) : (
            <span className="npm-dobra npm-dobra-esq" aria-hidden="true">
              <Dobra />
            </span>
          )}

          {pagina !== null && pagina !== undefined && (
            <span className="npm-numero">{pagina}</span>
          )}

          {onProximaPagina && (
            <button
              type="button"
              className="npm-dobra npm-dobra-dir"
              onClick={onProximaPagina}
              title="Próxima página"
              aria-label="Próxima página"
            >
              <Dobra />
            </button>
          )}
        </div>

        <div className="npm-barra">
          <div className="npm-trilha" ref={trilhaRef} onClick={cliqueTrilha}>
            {barra.visivel && (
              <div
                className="npm-polegar"
                style={{ top: barra.topo, height: barra.altura }}
                onPointerDown={arrastar}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <button
            type="button"
            className="npm-seta"
            aria-label="Rolar para cima"
            tabIndex={-1}
            disabled={!barra.visivel}
            onClick={() => rolarPor(-28)}
          >
            <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true">
              <polygon points="4.5,0 9,6 0,6" />
            </svg>
          </button>
          <button
            type="button"
            className="npm-seta"
            aria-label="Rolar para baixo"
            tabIndex={-1}
            disabled={!barra.visivel}
            onClick={() => rolarPor(28)}
          >
            <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true">
              <polygon points="0,0 9,0 4.5,6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Canto de página dobrado (o "orelha" do Note Pad)
function Dobra() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" shapeRendering="crispEdges">
      <polygon points="0.5,0.5 19.5,19.5 0.5,19.5" fill="#c9c9c9" stroke="#000" />
      <polygon points="1.5,6.5 13.5,18.5 1.5,18.5" fill="#8f8f8f" />
    </svg>
  );
}

/**
 * OPCIONAL: caixa de texto já no visual do Note Pad e que cresce com o texto
 * (assim a barra de rolagem da folha acompanha). Aceita as mesmas props de
 * um <textarea> (value, onChange, defaultValue, placeholder...).
 */
export function NotePadMacTexto({ className = "", onInput, ...props }) {
  const ref = useRef(null);

  const ajustar = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    ajustar();
  }, [ajustar, props.value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      spellCheck={false}
      className={`npm-texto ${className}`.trim()}
      onInput={(e) => {
        ajustar();
        if (onInput) onInput(e);
      }}
      {...props}
    />
  );
}