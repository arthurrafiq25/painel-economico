"use client";

import { useEffect } from "react";
import MapaInstitucional from "./MapaInstitucional";

/* ==========================================================================
   ✏️ PERSONALIZE AQUI - textos, o que aparece e como o modal se comporta.
   (Cores, espessuras das bordas, tamanho e proporção do monitor ficam no
   CSS, nas variáveis --mon-* do começo do arquivo modal-institucional.css.)
   ========================================================================== */
const MONITOR = {
  tituloAcessivel: "Órgãos Estatais do Brasil",

  // Faixa de baixo da tela
  mostrarFaixa: true,
  mostrarEmblema: true,
  emblemaTexto: "PAINEL BRASIL", // (a foto tem a marca do fabricante; aqui é o seu texto)
  listrasEmblema: ["#e0463a", "#e29529", "#f8e45a", "#4fb84a", "#2ca8cb"], // [] = sem listras
  rotuloPower: "POWER",
  mostrarPlaca: true,
  placaLinhas: ["MONITOR DE VÍDEO", "MODELO BR-1701"],

  // Painel de baixo (entradas de vídeo/áudio)
  mostrarBase: true,
  entradas: [
    { rotulo: "VIDEO", cor: "#f3e04a" },
    { rotulo: "AUDIO", cor: "#fbfbfa" },
  ],

  // Como fechar
  mostrarBotaoX: true, // botãozinho redondo ✕ no canto do monitor
  fecharNoBotaoPower: true, // o botão POWER do monitor também fecha ("desliga")
  fecharComEsc: true,

  // Evita que a página de trás role enquanto o modal está aberto
  travarRolagemDaPagina: true,
};

export default function ModalInstitucional({ onClose }) {
  // Tecla ESC fecha
  useEffect(() => {
    if (!MONITOR.fecharComEsc) return undefined;
    const aoTeclar = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  // Trava a rolagem da página de trás
  useEffect(() => {
    if (!MONITOR.travarRolagemDaPagina) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const antes = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = antes.html;
      body.style.overflow = antes.body;
    };
  }, []);

  const PowerTag = MONITOR.fecharNoBotaoPower ? "button" : "span";
  const propsPower = MONITOR.fecharNoBotaoPower
    ? { type: "button", onClick: onClose, title: "Desligar (fechar)", "aria-label": "Desligar e fechar" }
    : {};

  return (
    <div className="mon-overlay" role="dialog" aria-modal="true" aria-label={MONITOR.tituloAcessivel}>
      <div className="mon">

        {/* ===== FRENTE: aros da moldura + TELA (onde fica o mapa) ===== */}
        <div className="mon-frente">
          <div className="mon-aro mon-aro-1">
            <div className="mon-aro mon-aro-2">
              <div className="mon-aro mon-aro-3">
                <div className="mon-aro mon-aro-4">
                  <div className="mon-tela">
                    <MapaInstitucional />
                    <div className="mon-reflexo" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {MONITOR.mostrarBotaoX && (
            <button type="button" className="mon-x" onClick={onClose} aria-label="Fechar" title="Fechar">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* ===== FAIXA: emblema, placa e botão POWER ===== */}
        {MONITOR.mostrarFaixa && (
          <div className="mon-faixa" aria-hidden={MONITOR.fecharNoBotaoPower ? undefined : "true"}>
            <div className="mon-faixa-esq" />

            {MONITOR.mostrarEmblema && (
              <div className="mon-emblema" aria-hidden="true">
                <span className="mon-emblema-texto">{MONITOR.emblemaTexto}</span>
                <span className="mon-listras">
                  {MONITOR.listrasEmblema.map((c, i) => (
                    <i key={i} style={{ background: c }} />
                  ))}
                </span>
                <span className="mon-led-caixa">
                  <i className="mon-led" />
                  <b>{MONITOR.rotuloPower}</b>
                </span>
              </div>
            )}

            <div className="mon-faixa-meio" />

            {MONITOR.mostrarPlaca && (
              <div className="mon-placa" aria-hidden="true">
                {MONITOR.placaLinhas.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            )}

            <div className="mon-power-area">
              <PowerTag className="mon-power" {...propsPower} />
              <span className="mon-power-rotulo" aria-hidden="true">{MONITOR.rotuloPower}</span>
            </div>
          </div>
        )}

        {/* ===== BASE: entradas de vídeo e áudio ===== */}
        {MONITOR.mostrarBase && (
          <div className="mon-base" aria-hidden="true">
            <div className="mon-entradas">
              {MONITOR.entradas.map((e) => (
                <div className="mon-entrada" key={e.rotulo}>
                  <i className="mon-jack" style={{ "--jack-cor": e.cor }} />
                  <span>{e.rotulo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}