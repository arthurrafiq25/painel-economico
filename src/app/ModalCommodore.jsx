
"use client";

import { useEffect } from "react";

export default function ModalCommodore({ onClose }) {
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  const preto = "#000000";
  const lilas = "#A28FFF";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      {/* Base externa: contorno preto fino e área lilás */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(360px, 86vw)",
          aspectRatio: "1 / 1",
          boxSizing: "border-box",
          backgroundColor: lilas,
          border: `4px solid ${preto}`,
          padding: "0%",
          position: "relative",
          fontFamily: "'Press Start 2P', monospace",
          color: preto,
        }}
      >
        {/* Área interna da janela */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: lilas,
          }}
        >
          {/* Moldura pixelada e divisórias */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {/* Moldura principal com degraus nos cantos */}
            <path
              d="
                M 8 3
                H 92
                V 5 H 95
                V 8 H 97
                V 92
                H 95 V 95
                H 92 V 97
                H 8
                V 95 H 5
                V 92 H 3
                V 8
                H 5 V 5
                H 8 Z
              "
              fill="none"
              stroke={preto}
              strokeWidth="2"
              strokeLinejoin="miter"
            />

            {/* Divisória abaixo do título */}
            <path
              d="M 3 24 H 97"
              fill="none"
              stroke={preto}
              strokeWidth="2"
            />

            {/* Divisória acima do botão */}
            <path
              d="M 3 81 H 97"
              fill="none"
              stroke={preto}
              strokeWidth="2"
            />
          </svg>

          {/* Título */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "28%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "clamp(11px, 6.5vw, 21px)",
              whiteSpace: "nowrap",
            }}
          >
            PAINEL BRASIL
          </div>

          {/* Diretório */}
          <div
            style={{
            position: "absolute",
            top: "30%",
            left: "7%",
            right: "7%",
            bottom: "20%",
            fontSize: "clamp(8px, 2.5vw, 12px)",
            lineHeight: "1.8",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            overflowY: "auto",
          }}
          >
            Projeto independente com indicadores econômicos e sociais do Brasil. Feito por Arthur Aguiar.
            
            INSTAGRAM:{" "}
            <a
              href="https://www.instagram.com/_arthuraguiar.s"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#000",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              @_arthuraguiar.s
            </a>
          </div>
            
          </div>

          {/* Cancelar */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              left: "7%",
              bottom: 0,
              height: "22%",
              border: "none",
              background: "transparent",
              color: preto,
              padding: 0,
              fontFamily: "inherit",
              fontSize: "clamp(11px, 6.5vw, 23px)",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            CANCELAR
          </button>
        </div>
      </div>
  );
}
