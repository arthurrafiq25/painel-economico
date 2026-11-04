
"use client";

import { useEffect } from "react";

// PERSONALIZE AQUI
const TITULO = "SOBRE O PROJETO";

const TEXTO_PADRAO = [
  "O Painel Brasil reúne indicadores econômicos e sociais oficiais do Brasil, por estado e por período.",
  "O objetivo é oferecer informação factual e imparcial, com link para a fonte original em cada dado.",
  "Todos os dados vêm de fontes públicas oficiais (IBGE, Banco Central, Tesouro Nacional, ANP, entre outras).",
  "O projeto não tem opinião política: apenas apresenta os números, com data de atualização e link para a fonte.",
];



export default function ModalIBM({ onClose, children }) {
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    window.addEventListener("keydown", aoTeclar);

    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  return (
    <div className="ibm-fundo">
      <div
        className="ibm-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ibm-titulo"
      >
        {/* Título */}
        <div id="ibm-titulo" className="ibm-menu-titulo">
          -={TITULO}=-
        </div>

        {/* Conteúdo */}
        <div className="ibm-menu-corpo">
          {children ??
            TEXTO_PADRAO.map((l, i) => <p key={i}>{l}</p>)}
        </div>

        {/* Botão */}
        <button
          type="button"
          className="ibm-barra"
          onClick={onClose}
          autoFocus
        >
          FECHAR
        </button>
        </div>
      </div>
  );
}
