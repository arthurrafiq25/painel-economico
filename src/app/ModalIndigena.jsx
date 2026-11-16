"use client";

import { useEffect } from "react";

export default function ModalIndigena({ onClose }) {
  // Fecha ao apertar ESC
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
      padding: "20px"
    }}>
      {/* Janela Minecraft */}
      <div style={{
        width: "600px", maxWidth: "95vw", height: "500px", maxHeight: "90vh",
        backgroundColor: "#c6c6c6",
        borderTop: "2px solid #ffffff", borderLeft: "2px solid #ffffff",
        borderRight: "2px solid #555555", borderBottom: "2px solid #555555",
        boxShadow: "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #555555, 10px 10px 0px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column", fontFamily: "'Press Start 2P', monospace", position: "relative"
      }}>
        
        {/* Botão X (Estilo Minecraft) */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute", top: "8px", right: "8px", zIndex: 10,
            width: "24px", height: "24px", backgroundColor: "#c6c6c6",
            borderTop: "2px solid #ffffff", borderLeft: "2px solid #ffffff",
            borderRight: "2px solid #555555", borderBottom: "2px solid #555555",
            color: "#000", fontWeight: "bold", cursor: "pointer", display: "flex",
            justifyContent: "center", alignItems: "center", fontSize: "10px",
            fontFamily: "'Press Start 2P', monospace"
          }}
        >
          ✕
        </button>

        {/* Barra de Título Simples */}
        <div style={{
          padding: "20px 20px 10px 20px", borderBottom: "2px solid #555555",
          marginBottom: "10px", textAlign: "center"
        }}>
          <h2 style={{ fontSize: "14px", color: "#000", margin: 0, lineHeight: "1.5" }}>
            Povos Indígenas
          </h2>
          <p style={{ fontSize: "8px", color: "#444", marginTop: "8px" }}>
            Dados oficiais e fontes de apoio
          </p>
        </div>

        {/* Área de Conteúdo (com barra de rolagem estilo antigo) */}
        <div style={{ flex: 1, padding: "0 20px 20px 20px", overflowY: "auto", color: "#000", fontSize: "10px", lineHeight: "1.8" }}>
          
          <p style={{ marginBottom: "15px" }}>
            O Brasil abriga uma das maiores diversidades indígenas do mundo. Segundo o Censo 2022 do IBGE, são cerca de <strong>1,7 milhão de indígenas</strong>, distribuídos em 305 etnias e falando 274 línguas diferentes.
          </p>

          <div style={{ borderTop: "2px solid #555", margin: "15px 0" }} />

          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Terra Indígena (TI)</p>
          <p style={{ marginBottom: "15px", fontSize: "9px" }}>
            As TIs são áreas demarcadas pela União para posse permanente dos povos indígenas. Elas representam cerca de <strong>13% do território nacional</strong>, sendo fundamentais para a preservação cultural e ambiental.
          </p>

          <div style={{ borderTop: "2px solid #555", margin: "15px 0" }} />

          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Onde buscar informações e apoio:</p>
          
          <ul style={{ paddingLeft: "15px", fontSize: "9px", margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li>
              <a href="https://www.gov.br/funai/pt-br" target="_blank" rel="noopener noreferrer" style={{ color: "#0000cc", textDecoration: "underline" }}>
                FUNAI
              </a> - Fundação Nacional dos Povos Indígenas.
            </li>
            <li>
              <a href="https://www.socioambiental.org" target="_blank" rel="noopener noreferrer" style={{ color: "#0000cc", textDecoration: "underline" }}>
                ISA (Instituto Socioambiental)
              </a> - Dados e monitoramento de terras indígenas.
            </li>
            <li>
              <a href="https://www.ibge.gov.br" target="_blank" rel="noopener noreferrer" style={{ color: "#0000cc", textDecoration: "underline" }}>
                IBGE
              </a> - Censo Indígena 2022.
            </li>
            <li>
              <a href="https://www.apib.info" target="_blank" rel="noopener noreferrer" style={{ color: "#0000cc", textDecoration: "underline" }}>
                APIB
              </a> - Articulação dos Povos Indígenas do Brasil.
            </li>
          </ul>

          <div style={{ borderTop: "2px solid #555", margin: "20px 0 15px 0" }} />
          
          <p style={{ fontSize: "8px", color: "#555", fontStyle: "italic", textAlign: "center" }}>
            Dados: IBGE (Censo 2022) · FUNAI · ISA.
          </p>
        </div>
      </div>
    </div>
  );
}