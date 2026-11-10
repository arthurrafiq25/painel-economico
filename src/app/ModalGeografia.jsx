"use client";

import { useEffect, useState } from "react";

/* ==========================================================================
   ✏️ PERSONALIZE AQUI - ligue/desligue ou troque o que quiser neste bloco.
   (Cores, transparência, tamanho e blur do vidro ficam no CSS, no começo do
   arquivo modal-geografia.css, nas variáveis --w7-*.)
   ========================================================================== */
const W7 = {
  tituloJanela: "Geografia do Brasil",
  iconeJanela: "🌎",

  // Barra de endereço
  rotuloRaiz: "Geografia do Brasil", // 1ª parte do caminho (a 2ª é a aba ativa)
  mostrarBotaoAtualizar: true, // ícone verde de "atualizar" no fim do endereço

  // Pesquisa (o campo continua sendo um <input> controlado pelo estado "pesquisa")
  mostrarPesquisa: true,
  placeholderPesquisa: "Pesquisar {aba}", // {aba} vira o nome da aba ativa
  filtrarCardsPelaPesquisa: false, // true = digitar na pesquisa filtra os cards pelo título

  // Barra de comandos (Organizar, Nova pasta...) - só decorativa
  mostrarBarraComandos: false,
  comandos: [
    { rotulo: "Organizar", menu: true },
    { rotulo: "Incluir na biblioteca", menu: true },
    { rotulo: "Compartilhar com", menu: true },
    { rotulo: "Nova pasta", menu: false },
  ],

  // Rodapé
  mostrarBarraStatus: true,
};

export default function ModalGeografia({ onClose }) {
  const [abaAtiva, setAbaAtiva] = useState("Biomas");
  const [pesquisa, setPesquisa] = useState("");
  const [imagemErro, setImagemErro] = useState(false);

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

  // Filtro opcional pela pesquisa (desligado por padrão: W7.filtrarCardsPelaPesquisa)
  const termo = pesquisa.trim().toLowerCase();
  const cardsVisiveis =
    W7.filtrarCardsPelaPesquisa && termo
      ? cards.filter((c) => c.titulo.toLowerCase().includes(termo))
      : cards;

  const textoItens = W7.filtrarCardsPelaPesquisa
    ? `${cardsVisiveis.length} itens`
    : abaAtiva === "Biomas"
    ? "3 itens"
    : "0 itens";

  return (
    <div className="win7 w7-overlay">
      <div
        className="w7-window"
        role="dialog"
        aria-modal="true"
        aria-label={W7.tituloJanela}
      >
        {/* ===== BARRA DE TÍTULO (vidro) ===== */}
        <div className="w7-titlebar">
          <div className="w7-title-text">
            <span className="w7-title-icon">{W7.iconeJanela}</span>
            {W7.tituloJanela}
          </div>

          <div className="w7-controls">
            <button
              type="button"
              className="w7-close"
              aria-label="Fechar"
              title="Fechar"
              onClick={onClose}
            >
              <svg width="14" height="8" viewBox="0 0 14 10" aria-hidden="true">
                <path d="M2.2 1.2l9.6 7.6M11.8 1.2L2.2 8.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ===== NAVEGAÇÃO: orbes + endereço + pesquisa (também no vidro) ===== */}
        <div className="w7-toolbar">
          {/* Para tornar funcional: troque cada <span> por <button type="button" onClick={...}> */}
          <div className="w7-navigation" aria-hidden="true">
            <span className="w7-nav-button w7-nav-back">
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M11.5 2.5L2 12l9.5 9.5v-5.6H22V8.1H11.5z" fill="#1f4f8c" stroke="rgba(255,255,255,.9)" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="w7-nav-button w7-nav-forward">
              <svg width="13" height="13" viewBox="0 0 24 24">
                <path d="M12.5 2.5L22 12l-9.5 9.5v-5.6H2V8.1h10.5z" fill="#8c9db1" stroke="rgba(255,255,255,.9)" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <div className="w7-address">
            <svg className="w7-folder-icon" width="18" height="15" viewBox="0 0 24 20" aria-hidden="true">
              <path d="M1.5 3h7.5l2 2.2h11.5v13.3h-21z" fill="#d6a42a" />
              <path d="M1.5 7h21v11.5h-21z" fill="#f4d56a" stroke="#b9891f" strokeWidth="0.8" />
            </svg>

            <div className="w7-address-path">
              <span className="w7-breadcrumb">{W7.rotuloRaiz}</span>
              <span className="w7-breadcrumb-arrow" aria-hidden="true" />
              <span className="w7-breadcrumb w7-breadcrumb-current">{abaAtiva}</span>
              <span className="w7-breadcrumb-arrow" aria-hidden="true" />
            </div>

            <span className="w7-address-arrow" aria-hidden="true" />
            {W7.mostrarBotaoAtualizar && (
              <span className="w7-address-refresh" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24">
                  <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" fill="none" stroke="#3f9b34" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M21.5 2.5v7.2h-7.2z" fill="#3f9b34" />
                </svg>
              </span>
            )}
          </div>

          {W7.mostrarPesquisa && (
            <div className="w7-search">
              <input
                type="text"
                placeholder={W7.placeholderPesquisa.replace("{aba}", abaAtiva)}
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                aria-label="Pesquisar conteúdo"
              />
              <svg className="w7-search-icon" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
                <path d="M15 15l6.5 6.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* ===== ÁREA CLIENTE: branca e opaca ===== */}
        <div className="w7-body">
          {W7.mostrarBarraComandos && (
            <div className="w7-commandbar" aria-hidden="true">
              {W7.comandos.map((c) => (
                <span key={c.rotulo} className={c.menu ? "w7-command w7-command-menu" : "w7-command"}>
                  {c.rotulo}
                </span>
              ))}
            </div>
          )}

          <div className="w7-explorer">
            <aside className="w7-sidebar">
              <div className="w7-sidebar-heading">
                <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3 6.6 7.2.8-5.4 4.8 1.6 7.1L12 17.6 5.6 21.3l1.6-7.1L1.8 9.4 9 8.6z" fill="#f6c846" stroke="#d99a1c" strokeWidth="1" strokeLinejoin="round" />
                </svg>
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
                      onClick={() => {
                        setImagemErro(false);
                        setAbaAtiva(item.id);
}}
                      aria-current={abaAtiva === item.id ? "page" : undefined}
                    >
                      <span className="w7-menu-icon">{item.icone}</span>
                      {item.id}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="w7-content">
              <div className="w7-content-header">
                <div>
                  <span className="w7-content-eyebrow">GEOGRAFIA DO BRASIL</span>
                  <h2>{abaAtiva}</h2>
                </div>
                <div />
              </div>

              <p className="w7-content-description">
                Elementos e informações sobre {abaAtiva.toLowerCase()}.
              </p>

              {/* IMAGEM GIGANTE QUE MUDA CONFORME A ABA */}
              <div style={{ width: "100%", marginTop: "10px", display: "flex", justifyContent: "center" }}>
                <img 
                  src={`/infografico_${abaAtiva.toLowerCase()}.png`} 
                  alt={`Infográfico de ${abaAtiva}`} 
                  style={{ maxWidth: "80%", height: "auto", display: "block" }} 
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              

              <div className="w7-content-bottom">
                <span>Geografia do Brasil</span>
                <span>Explorador de conteúdo</span>
              </div>
            </main>
          </div>

          {W7.mostrarBarraStatus && (
            <div className="w7-statusbar">
              <div className="w7-status-left">
                <svg className="w7-status-icon" width="30" height="25" viewBox="0 0 24 20" aria-hidden="true">
                  <path d="M1.5 3h7.5l2 2.2h11.5v13.3h-21z" fill="#d6a42a" />
                  <path d="M1.5 7h21v11.5h-21z" fill="#f4d56a" stroke="#b9891f" strokeWidth="0.8" />
                </svg>
                <span>{textoItens}</span>
              </div>

              <span className="w7-status-right">{abaAtiva}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}