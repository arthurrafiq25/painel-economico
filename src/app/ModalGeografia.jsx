
"use client";

import { useEffect, useState } from "react";

export default function ModalGeografia({ onClose }) {
  const [abaAtiva, setAbaAtiva] = useState("Biomas");
  const [pesquisa, setPesquisa] = useState("");

  // Bloqueia a rolagem da página enquanto o modal estiver aberto
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    const estilosAnteriores = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.position = estilosAnteriores.position;
      body.style.top = estilosAnteriores.top;
      body.style.left = estilosAnteriores.left;
      body.style.right = estilosAnteriores.right;
      body.style.width = estilosAnteriores.width;
      body.style.overflow = estilosAnteriores.overflow;
      html.style.overflow = estilosAnteriores.htmlOverflow;

      window.scrollTo(0, scrollY);
    };
  }, []);

  const menu = [
    { id: "Biomas", icone: "🌳" },
    { id: "Relevo", icone: "⛰️" },
    { id: "Clima", icone: "☁️" },
    { id: "Hidrografia", icone: "💧" },
    { id: "Fronteiras", icone: "🚧" },
  ];

  const cards = [
    { titulo: "Visão Geral", numero: "01" },
    { titulo: "Características", numero: "02" },
    { titulo: "Distribuição", numero: "03" },
  ];

  return (
    <div
      className="win7 w7-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.42)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        padding: "20px",
      }}
    >
      <style>{`
        /* =========================================
           JANELA PRINCIPAL
        ========================================= */

        .win7 .w7-window {
          position: relative;
          box-sizing: border-box;
          width: 900px;
          max-width: 95vw;
          height: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 0 !important;
          margin: 0;
          overflow: hidden;
          border: 1px solid rgba(115, 169, 210, 0.95) !important;
          border-radius: 8px 8px 4px 4px !important;
          background: transparent !important;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.85),
            0 2px 5px rgba(0,0,0,0.25),
            0 12px 32px rgba(0,0,0,0.45),
            0 30px 60px rgba(0,0,0,0.25) !important;
          font-family: "Segoe UI", Tahoma, sans-serif;
          color: #222;
        }

        .win7 .w7-window,
        .win7 .w7-window *,
        .win7 .w7-window *::before,
        .win7 .w7-window *::after {
          box-sizing: border-box;
          transition: none !important;
          animation: none !important;
        }

        .win7 .w7-window::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 8;
          border-radius: inherit;
          pointer-events: none;
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.95),
            inset 1px 0 rgba(255,255,255,0.5),
            inset -1px 0 rgba(255,255,255,0.35);
        }

                .win7 .w7-titlebar {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          height: 39px;
          min-height: 39px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6px 0 12px !important;
          margin: 0 !important;
          overflow: hidden;
          border: none !important;
          border-bottom: 1px solid rgba(91, 145, 187, 0.55) !important;
          border-radius: 7px 7px 0 0 !important;

          /* MUDANÇA AQUI: Fundo transparente */
          background: rgba(255, 255, 255, 0.15) !important;

          box-shadow:
            inset 0 1px rgba(255,255,255,0.95),
            inset 0 3px 8px rgba(255,255,255,0.25),
            inset 0 -1px rgba(255,255,255,0.35);

          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
        }

        .win7 .w7-titlebar::before {
          content: "";
          position: absolute;
          top: 0;
          left: 2px;
          right: 2px;
          height: 65%;
          pointer-events: none;
          border-radius: 7px 7px 50% 50%;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.65),
            rgba(255,255,255,0.15) 65%,
            transparent
          );
        }

        .win7 .w7-titlebar::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgba(255,255,255,0.55);
          pointer-events: none;
        }

        .win7 .w7-title-text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #172c3e !important;
          font-family: "Segoe UI", Tahoma, sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 1px white !important;
        }

        .win7 .w7-title-icon {
          font-size: 17px;
        }

        /* =========================================
           BOTÃO FECHAR
        ========================================= */

        .win7 .w7-controls {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: flex-start;
          gap: 0;
          height: 25px;
          margin: -1px 0 0 auto !important;
        }

        .win7 .w7-controls button {
          position: relative;
          appearance: none !important;
          -webkit-appearance: none !important;
          width: 47px !important;
          min-width: 47px !important;
          height: 21px !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 1px solid #8c2924 !important;
          border-top: none !important;
          border-radius: 0 0 4px 4px !important;

          background: linear-gradient(
            180deg,
            #f5c5bd 0%,
            #ec7e70 30%,
            #d94437 68%,
            #a92724 100%
          ) !important;

          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.8),
            inset 0 -2px 3px rgba(100,0,0,0.25),
            0 1px 3px rgba(0,0,0,0.2) !important;

          cursor: pointer;
        }

        .win7 .w7-controls button::before {
          content: "×";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 19px;
          font-weight: 400;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .win7 .w7-controls button:hover,
        .win7 .w7-controls button:focus {
          background: linear-gradient(
            180deg,
            #f5c5bd 0%,
            #ec7e70 30%,
            #d94437 68%,
            #a92724 100%
          ) !important;
          outline: none !important;
          filter: none !important;
          transform: none !important;
        }

        /* =========================================
           CORPO BRANCO E OPACO
        ========================================= */

        .win7 .w7-body {
          position: relative;
          z-index: 1;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
          background: #fff !important;
          color: #222;
          opacity: 1 !important;
        }

        /* =========================================
           BARRA DE NAVEGAÇÃO COM VIDRO AERO
        ========================================= */

        .win7 .w7-toolbar {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 10px;

          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.58) 0%,
            rgba(229,243,255,0.42) 48%,
            rgba(190,220,244,0.50) 100%
          );

          border-bottom: 1px solid rgba(115,157,192,0.50);

          box-shadow:
            inset 0 1px rgba(255,255,255,0.85),
            inset 0 -1px rgba(255,255,255,0.35);

          backdrop-filter: blur(26px) saturate(170%);
          -webkit-backdrop-filter: blur(26px) saturate(170%);
        }

        .win7 .w7-navigation {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* =========================================
           SETAS REDONDAS E EM NEGRITO
        ========================================= */

        .win7 .w7-nav-button {
          appearance: none !important;
          -webkit-appearance: none !important;
          width: 34px !important;
          min-width: 34px !important;
          height: 34px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;

          border: 1px solid rgba(100,145,180,0.85) !important;
          border-radius: 50% !important;

          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e9f4fc 55%,
            #c8e0f1 100%
          ) !important;

          color: #315a7b !important;
          font-family: Arial, sans-serif !important;
          font-size: 25px !important;
          font-weight: 900 !important;
          line-height: 1 !important;

          box-shadow:
            inset 0 1px 2px white,
            0 1px 2px rgba(0,0,0,0.12);

          cursor: pointer;
        }

        .win7 .w7-nav-button:hover,
        .win7 .w7-nav-button:focus,
        .win7 .w7-nav-button:active {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e9f4fc 55%,
            #c8e0f1 100%
          ) !important;

          color: #315a7b !important;
          outline: none !important;
          filter: none !important;
          transform: none !important;
          box-shadow:
            inset 0 1px 2px white,
            0 1px 2px rgba(0,0,0,0.12) !important;
        }

        /* =========================================
           BARRA DE ENDEREÇO
        ========================================= */

        .win7 .w7-address {
          position: relative;
          height: 30px;
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 8px;
          border: 1px solid #9cabb9;
          border-radius: 3px;
          background: #fff;
          box-shadow:
            inset 0 1px 3px rgba(0,0,0,0.12),
            0 1px white;
        }

        .win7 .w7-folder-icon {
          flex-shrink: 0;
          font-size: 15px;
        }

        .win7 .w7-address-path {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          overflow: hidden;
          white-space: nowrap;
          font-family: "Segoe UI", sans-serif;
          font-size: 12px;
        }

        .win7 .w7-breadcrumb {
          color: #374b5d;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .win7 .w7-breadcrumb-current {
          color: #1d4d73;
          font-weight: 600;
        }

        .win7 .w7-breadcrumb-arrow {
          color: #7195b1;
          font-size: 15px;
        }

        .win7 .w7-address-arrow {
          flex-shrink: 0;
          margin-left: auto;
          color: #6b8194;
          font-size: 9px;
        }

        /* =========================================
           PESQUISA
        ========================================= */

        .win7 .w7-search {
          flex-shrink: 0;
          width: 190px;
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 7px;
          border: 1px solid #a1b2c1;
          border-radius: 3px;
          background: #fff;
          box-shadow:
            inset 0 1px 3px rgba(0,0,0,0.1),
            0 1px white;
        }

        .win7 .w7-search input {
          appearance: none !important;
          flex: 1;
          min-width: 0;
          margin: 0;
          padding: 0;
          border: none !important;
          outline: none !important;
          color: #333 !important;
          background: transparent !important;
          box-shadow: none !important;
          font-family: "Segoe UI", sans-serif !important;
          font-size: 12px !important;
        }

        .win7 .w7-search input::placeholder {
          color: #8997a4;
        }

        .win7 .w7-search-icon {
          color: #527d9e;
          font-size: 18px;
          margin-left: 5px;
        }

        /* =========================================
           EXPLORER
        ========================================= */

        .win7 .w7-explorer {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: hidden;
          background: #fff;
        }

        /* =========================================
           MENU LATERAL
        ========================================= */

        .win7 .w7-sidebar {
          flex-shrink: 0;
          width: 205px;
          padding: 14px 9px;
          overflow-y: auto;
          background: linear-gradient(
            90deg,
            #f7f9fb 0%,
            #f1f5f9 75%,
            #eaf0f5 100%
          );
          border-right: 1px solid #c4ced8;
          box-shadow: inset -1px 0 rgba(255,255,255,0.9);
        }

        .win7 .w7-sidebar-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          margin-bottom: 8px;
          color: #245783;
          font-family: "Segoe UI", sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-shadow: 0 1px white;
        }

        .win7 .w7-sidebar-heading-icon {
          font-size: 12px;
        }

        .win7 .w7-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .win7 .w7-menu li {
          padding: 0;
          margin: 0;
        }

        .win7 .w7-menu-item {
          appearance: none !important;
          position: relative;
          width: 100%;
          min-height: 29px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px !important;
          border: 1px solid transparent !important;
          border-radius: 2px !important;
          background: transparent !important;
          color: #493030 !important;
          font-family: "Segoe UI", sans-serif !important;
          font-size: 12px !important;
          text-align: left;
          cursor: pointer;
        }

        .win7 .w7-menu-item:hover,
        .win7 .w7-menu-item:focus {
          border-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          outline: none !important;
          filter: none !important;
          transform: none !important;
        }

        .win7 .w7-menu-item.active {
          border-color: #9fc8e7 !important;
          background: #fadcdc !important;
          color: #155e96 !important;
          font-weight: 600;
          box-shadow: inset 0 1px white;
        }

        .win7 .w7-menu-icon {
          width: 19px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          font-size: 14px;
        }

        /* =========================================
           CONTEÚDO PRINCIPAL
        ========================================= */

        .win7 .w7-content {
          position: relative;
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 20px 24px 12px;
          overflow-y: auto;
          background: #fff;
        }

        .win7 .w7-content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 11px;
          margin-bottom: 13px;
          border-bottom: 1px solid #e5eaf0;
        }

        .win7 .w7-content-eyebrow {
          color: #879aa9;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        .win7 .w7-content-header h2 {
          margin: 4px 0 0 !important;
          color: #28719a !important;
          font-family: "Segoe UI", sans-serif !important;
          font-size: 21px !important;
          font-weight: 400 !important;
          text-shadow: 0 1px white;
        }

        .win7 .w7-content-description {
          margin: 0 0 13px;
          color: #6e7e8b;
          font-size: 11px;
        }

        /* =========================================
           CARDS
        ========================================= */

        .win7 .w7-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: start;
          gap: 16px;
        }

        .win7 .w7-card {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 9px 8px 10px;
          border: 1px solid transparent;
          border-radius: 2px;
          background: transparent;
          text-align: center;
        }

        .win7 .w7-card:hover,
        .win7 .w7-card:focus {
          border-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          transform: none !important;
        }

        .win7 .w7-card-number {
          align-self: flex-start;
          margin-bottom: 7px;
          color: #94a9ba;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .win7 .w7-card-image {
          width: 100%;
          height: 135px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px;
          border: 1px solid #d1e0ec;
          border-radius: 2px;
          background: linear-gradient(
            145deg,
            #fafdff 0%,
            #edf5fb 48%,
            #e0edf7 100%
          );
          box-shadow:
            inset 0 1px 3px rgba(60,100,140,0.09),
            0 1px 0 white;
          color: #8096a8;
          font-size: 10px;
          line-height: 1.5;
        }

        .win7 .w7-card-image span {
          max-width: 145px;
          text-align: center;
        }

        .win7 .w7-card h3 {
          margin: 10px 0 4px !important;
          color: #315b7c !important;
          font-family: "Segoe UI", sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }

        .win7 .w7-card p {
          margin: 0 !important;
          color: #7b8b98 !important;
          font-family: "Segoe UI", sans-serif !important;
          font-size: 10px !important;
          line-height: 1.5 !important;
        }

        .win7 .w7-content-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 15px;
          color: #9aaab7;
          font-size: 10px;
        }

        /* =========================================
           BARRA DE STATUS
        ========================================= */

        .win7 .w7-statusbar {
          flex-shrink: 0;
          min-height: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          border-top: 1px solid #c8d3dd;
          background: linear-gradient(
            180deg,
            #f7f9fb,
            #eaf0f5
          );
          box-shadow: inset 0 1px white;
          color: #566b7d;
          font-size: 10px;
        }

        .win7 .w7-status-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .win7 .w7-status-icon {
          font-size: 13px;
        }

        .win7 .w7-status-right {
          color: #8797a4;
        }

        /* =========================================
           SCROLLBARS
        ========================================= */

        .win7 .w7-window ::-webkit-scrollbar {
          width: 13px;
          height: 13px;
        }

        .win7 .w7-window ::-webkit-scrollbar-track {
          background: #f0f3f6;
          border-left: 1px solid #e0e6eb;
        }

        .win7 .w7-window ::-webkit-scrollbar-thumb {
          border: 3px solid #f0f3f6;
          border-radius: 10px;
          background: #9bbbd4;
        }

        .win7 .w7-window ::-webkit-scrollbar-thumb:hover {
          background: #9bbbd4;
        }

        /* =========================================
           REMOÇÃO DE EFEITOS E BRILHOS DE HOVER
        ========================================= */

        .win7 .w7-window *,
        .win7 .w7-window *::before,
        .win7 .w7-window *::after {
          transition: none !important;
          animation: none !important;
        }

        .win7 .w7-window button:hover,
        .win7 .w7-window button:focus,
        .win7 .w7-window button:active {
          filter: none !important;
          transform: none !important;
        }

        .win7 .w7-breadcrumb:hover {
          color: #374b5d !important;
          text-decoration: none !important;
        }

        /* =========================================
           RESPONSIVIDADE
        ========================================= */

        @media (max-width: 760px) {
          .win7 .w7-window {
            width: 96vw;
            height: 90vh;
          }

          .win7 .w7-toolbar {
            flex-wrap: wrap;
            padding: 7px;
          }

          .win7 .w7-address {
            order: 2;
            flex-basis: calc(100% - 145px);
          }

          .win7 .w7-search {
            order: 3;
            flex: 1;
            width: auto;
          }

          .win7 .w7-explorer {
            flex-direction: column;
          }

          .win7 .w7-sidebar {
            width: 100%;
            padding: 8px 10px;
            border-right: none;
            border-bottom: 1px solid #c4ced8;
          }

          .win7 .w7-menu {
            flex-direction: row;
            gap: 4px;
            overflow-x: auto;
          }

          .win7 .w7-menu li {
            flex-shrink: 0;
          }

          .win7 .w7-menu-item {
            width: auto;
            white-space: nowrap;
          }

          .win7 .w7-content {
            padding: 15px;
          }

          .win7 .w7-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .win7.w7-overlay {
            padding: 7px !important;
          }

          .win7 .w7-window {
            width: 100%;
            height: 94vh;
            max-height: 94vh;
          }

          .win7 .w7-titlebar {
            min-height: 35px;
            height: 35px;
          }

          .win7 .w7-search {
            flex-basis: 100%;
          }

          .win7 .w7-address {
            flex-basis: 100%;
          }

          .win7 .w7-cards {
            grid-template-columns: 1fr;
          }

          .win7 .w7-card-image {
            height: 155px;
          }

          .win7 .w7-content-header h2 {
            font-size: 19px !important;
          }
        }
      `}</style>

      <div
        className="w7-window"
        role="dialog"
        aria-modal="true"
        aria-label="Geografia do Brasil"
        style={{
          width: "900px",
          maxWidth: "95%",
          height: "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="title-bar w7-titlebar">
          <div className="title-bar-text w7-title-text">
            <span className="w7-title-icon">🌎</span>
            Geografia do Brasil
          </div>

          <div className="title-bar-controls w7-controls">
            <button
              type="button"
              aria-label="Close"
              title="Fechar"
              onClick={onClose}
            />
          </div>
        </div>

        <div
          className="window-body w7-body"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div className="w7-toolbar">
            <div className="w7-navigation">
              <button
                type="button"
                className="w7-nav-button"
                aria-label="Voltar"
                title="Voltar"
              >
                ‹
              </button>

              <button
                type="button"
                className="w7-nav-button"
                aria-label="Avançar"
                title="Avançar"
              >
                ›
              </button>
            </div>

            <div className="w7-address">
              <span className="w7-folder-icon">📁</span>

              <div className="w7-address-path">
                <span className="w7-breadcrumb">
                  Geografia do Brasil
                </span>

                <span className="w7-breadcrumb-arrow">›</span>

                <span className="w7-breadcrumb w7-breadcrumb-current">
                  {abaAtiva}
                </span>
              </div>

              <span className="w7-address-arrow">▼</span>
            </div>

            <div className="w7-search">
              <input
                type="text"
                placeholder="Pesquisar"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                aria-label="Pesquisar conteúdo"
              />

              <span className="w7-search-icon">⌕</span>
            </div>
          </div>

          <div className="w7-explorer">
            <aside className="w7-sidebar">
              <div className="w7-sidebar-heading">
                <span className="w7-sidebar-heading-icon">⭐</span>
                Favoritos
              </div>

              <ul className="w7-menu">
                {menu.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={
                        abaAtiva === item.id
                          ? "w7-menu-item active"
                          : "w7-menu-item"
                      }
                      onClick={() => setAbaAtiva(item.id)}
                      aria-current={
                        abaAtiva === item.id ? "page" : undefined
                      }
                    >
                      <span className="w7-menu-icon">
                        {item.icone}
                      </span>

                      {item.id}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="w7-content">
              <div className="w7-content-header">
                <div>
                  <span className="w7-content-eyebrow">
                    GEOGRAFIA DO BRASIL
                  </span>

                  <h2>{abaAtiva}</h2>
                </div>

                <div />
              </div>

              <p className="w7-content-description">
                Elementos e informações sobre {abaAtiva.toLowerCase()}.
              </p>

              <div className="w7-cards">
                {cards.map((card) => (
                  <article className="w7-card" key={card.numero}>
                    <span className="w7-card-number">
                      {card.numero}
                    </span>

                    <div className="w7-card-image">
                      <span>
                        [ESPAÇO PARA INFOGRÁFICO / IMAGEM]
                      </span>
                    </div>

                    <h3>{card.titulo}</h3>

                    <p>
                      Texto breve sobre {abaAtiva.toLowerCase()}.
                    </p>
                  </article>
                ))}
              </div>

              <div className="w7-content-bottom">
                <span>Geografia do Brasil</span>
                <span>Explorador de conteúdo</span>
              </div>
            </main>
          </div>

          <div className="w7-statusbar">
            <div className="w7-status-left">
              <span className="w7-status-icon">📁</span>

              <span>
                {abaAtiva === "Biomas" ? "3 itens" : "0 itens"}
              </span>
            </div>

            <span className="w7-status-right">
              {abaAtiva}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
