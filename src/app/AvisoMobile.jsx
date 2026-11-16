"use client";

import { useState, useEffect } from "react";

export default function AvisoMobile() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // Verifica se a tela é pequena (celular)
    if (window.innerWidth < 768) {
      // Verifica se o usuário já fechou o aviso nesta sessão
      const jaFechou = sessionStorage.getItem("avisoMobileFechado");
      if (!jaFechou) {
        setVisivel(true);
      }
    }
  }, []);

  const fechar = () => {
    setVisivel(false);
    sessionStorage.setItem("avisoMobileFechado", "true");
  };

  if (!visivel) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: "20px", fontFamily: "Verdana, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#d4d0c8", border: "2px solid #000",
        maxWidth: "350px", width: "100%", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)"
      }}>
        {/* Barra de título estilo Windows 95 */}
        <div style={{
          backgroundColor: "#000080", color: "#fff",
          padding: "4px 8px", display: "flex", justifyContent: "space-between",
          alignItems: "center", fontWeight: "bold", fontSize: "13px"
        }}>
          <span>⚠️ Aviso de Compatibilidade</span>
          <button onClick={fechar} style={{
            background: "#d4d0c8", border: "1px solid #fff", color: "#000",
            cursor: "pointer", fontWeight: "bold", padding: "0 4px", fontSize: "12px"
          }}>X</button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: "15px", fontSize: "12px", lineHeight: "1.5", color: "#000" }}>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src="/aviso-mobile.gif" alt="Aviso" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
          <p style={{ margin: "0 0 10px 0" }}>
            Olá! Este site foi projetado para ser visto em <strong>computadores (desktop)</strong>.
          </p>
          <p style={{ margin: "0 0 10px 0" }}>
            No celular, algumas informações podem ficar apertadas ou fora do lugar. Para uma experiência completa, acesse pelo computador.
          </p>
          <div style={{ textAlign: "right", marginTop: "15px" }}>
            <button onClick={fechar} style={{
              backgroundColor: "#d4d0c8", border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "3px 20px", fontFamily: "Verdana, sans-serif",
              fontSize: "12px", cursor: "pointer"
            }}>
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}