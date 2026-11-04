"use client";

import { useState, useEffect } from "react";
import MapaBrasil from "./MapaBrasil";
import Modal from "./Modal";
import NavegadorNoticias from "./NavegadorNoticias";
import TerminalIndicadores from "./TerminalIndicadores";
import NotePadMac from "./NotePadMac";
import ModalCommodore from "./ModalCommodore";
import ModalIBM from "./ModalIBM";
import ModalApple from "./ModalApple";

// =========================================
// 1. DADOS FIXOS (Não mudam com frequência)
// =========================================

// Janela Principal (Titulos)

const EMOJI_TITULO = "🗺️";
const TITULO_JANELA = "Brasil";

const REGIOES = [
  { id: "1", nome: "• Norte" },
  { id: "2", nome: "• Nordeste" },
  { id: "3", nome: "• Sudeste" },
  { id: "4", nome: "• Centro-Oeste" },
  { id: "5", nome: "• Sul" },
];

const NOME_REGIAO = { "1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Centro-Oeste", "5": "Sul" };

// =========================================
// 2. FUNÇÕES AUXILIARES
// =========================================

const fmt = (n) => Math.round(n).toLocaleString("pt-BR");

// =========================================
// 3. ESTADOS (Controle da Página)
// =========================================

// -- Seleção no Mapa e Menu Lateral --
export default function Home() {
  const [estadoHover, setEstadoHover] = useState(null);
  const [regiaoSel, setRegiaoSel] = useState(null);
  const [dadosRegiao, setDadosRegiao] = useState(null);
  const [modalAberto, setModalAberto] = useState(null);
  const [estadoLinksAberto, setEstadoLinksAberto] = useState(null);
  const [linksEstados, setLinksEstados] = useState({});
  const [infoAberta, setInfoAberta] = useState(false);
  const [modalIndicadores, setModalIndicadores] = useState(false);
  const [indicadores, setIndicadores] = useState({});
  const [dadosBrasil, setDadosBrasil] = useState(null);
  const [brasilLinksAberto, setBrasilLinksAberto] = useState(false);
  const [modalNoticias, setModalNoticias] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [modalGlossario, setModalGlossario] = useState(false);

// =========================================
// 4. EFEITOS (Carregamento inicial)
// =========================================

// Efeitos (Carrega os dados dos JSONs assim que a página abre).
useEffect(() => {
  fetch("/estados-links.json").then((r) => r.json()).then(setLinksEstados).catch(() => {});
  fetch("/selic.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, selic: d }))).catch(() => {});
  fetch("/ipca.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, ipca: d }))).catch(() => {});
  fetch("/cambio.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, cambio: d }))).catch(() => {});
  fetch("/desemprego.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, desemprego: d }))).catch(() => {});
  fetch("/noticias.json").then((r) => r.json()).then(setNoticias).catch(() => {});
  fetch("/salario-minimo.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, salario: d }))).catch(() => {});
  fetch("/ipca-alimentacao.json").then((r) => r.json()).then((d) => setIndicadores((p) => ({ ...p, ipcaAlimentacao: d }))).catch(() => {});
}, []);

// Função de fechar o balão 'Mais informações' ao clicar fora.

useEffect(() => {
  const fechar = () => setInfoAberta(false);
  if (infoAberta) {
    const timer = setTimeout(() => document.addEventListener("click", fechar), 0);
    return () => { clearTimeout(timer); document.removeEventListener("click", fechar); };
  }
}, [infoAberta]);

// =========================================
// 5. AÇÔES (Cliques do usuário)
// =========================================

   // Ação: clicar em uma região no menu.

    const handleRegiao = async (id) => {
    setRegiaoSel(id);
    setEstadoHover(null);
    setDadosBrasil(null);
    if (id === null) {
      setDadosRegiao(null);
      return;
    }
    const r = await fetch("/dados-regiao.json");
    const d = await r.json();
    setDadosRegiao({
      pib: d.pib[id],
      populacao: d.populacao[id],
      perCapita: d.perCapita[id],
      agro: d.agro[id],
      industria: d.industria[id],
      servicos: d.servicos[id],
      administracao: d.administracao[id],
      impostos: d.impostos[id],
    });
  };

 // Ação: clicar no nome "Brasil" no topo do mapa.
 
  const handleBrasil = async () => {
    setRegiaoSel(null);
    setEstadoHover(null);
    const [pib, pop, perCapita, agro, industria, servicos, adm, impostos] = await Promise.all([
      fetch("/pib-uf.json").then((r) => r.json()),
      fetch("/populacao-uf.json").then((r) => r.json()),
      fetch("/pib-per-capita-uf.json").then((r) => r.json()),
      fetch("/agropecuaria-uf.json").then((r) => r.json()),
      fetch("/industria-uf.json").then((r) => r.json()),
      fetch("/servicos-uf.json").then((r) => r.json()),
      fetch("/administracao-uf.json").then((r) => r.json()),
      fetch("/impostos-uf.json").then((r) => r.json()),
    ]);

    const somar = (obj) => Object.values(obj).reduce((acc, v) => acc + (v || 0), 0);
    const pibTotal = somar(pib);
    const popTotal = somar(pop);

    setDadosBrasil({
      pib: pibTotal,
      populacao: popTotal,
      perCapita: popTotal ? Math.round((pibTotal * 1000) / popTotal) : 0,
      agro: somar(agro),
      industria: somar(industria),
      servicos: somar(servicos),
      administracao: somar(adm),
      impostos: somar(impostos),
    });
  };

  return (
    <main>
      {/* ======================================*/}
      {/*   6. LAYOUT PRINCIPAL (Mapa + Menu)   */}
      {/* ======================================*/}

      <div style={{ maxWidth: "890px", margin: "0 auto", textAlign: "left", paddingLeft: "20px", marginBottom: "8px" }}>
  <img src="/logo site_01.png" alt="Painel Brasil" style={{ height: "45px", width: "auto" }} />
</div>
<div style={{ maxWidth: "830px", margin: "0 auto" }}>
  <div className="barra-topo"></div>
</div>
<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <div style={{ width: "600px" }}>
      <p className="subtitulo">
        Indicadores econômicos por estado (em desenvolvimento)
      </p>
      {/* --- 6.1 Janela do Mapa --- */}
<div className="janela-win95">
  <div className="janela-titulo-win95">
    <span>
      {EMOJI_TITULO}{" "}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleBrasil(); }}
        style={{ color: "#ffffff", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
      >
        {TITULO_JANELA}
      </a>
    </span>
    {(estadoHover || regiaoSel || dadosBrasil) && (
      <button
        className="botao-win95"
        onClick={() => { setEstadoHover(null); handleRegiao(null); setDadosBrasil(null); }}
        title="Limpar seleção"
      >
        ↻
      </button>
    )}
  </div>

  <div className="conteudo-win95">
    <div className="painel painel-mapa">
      <div style={{ position: "relative" }}>
        <div style={{ marginTop: "30px" }}> 
          <MapaBrasil onEstadoChange={(estado) => { setEstadoHover(estado); setDadosBrasil(null); setRegiaoSel(null); }} siglaSelecionada={estadoHover ? estadoHover.sigla : null} regiaoSel={regiaoSel} />
        </div>
        <div style={{ position: "absolute", top: "80px", right: "5px", fontSize: "15px" }}>
          {REGIOES.map((r) => (
            <div key={r.nome} style={{ marginBottom: "4px" }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleRegiao(r.id); }}
                style={{ color: "#0000cc", textDecoration: "underline", fontWeight: regiaoSel === r.id ? "bold" : "normal" }}
              >
                {r.nome}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "10px", left: "0", right: "0", fontSize: "12px", color: "#000080", fontWeight: "bold", textAlign: "center" }}>
        {estadoHover
          ? estadoHover.nome + " (" + estadoHover.sigla + ")" +
            (estadoHover.info ? " · Capital: " + estadoHover.info.capital + " · Região: " + estadoHover.info.regiao + " · Fuso: " + estadoHover.info.fuso : "")
          : " "}
      </div>
    </div>
  </div>
</div>
      {/* --- 6.2 Janela do Painel de Informações --- */}
      <div className="janela-win95">
        <div className="janela-titulo-win95">
          <span>ℹ️ Painel</span>
        </div>
        <div className="conteudo-win95-painel">
          <div className="painel">
  {dadosBrasil ? (
    <>
      <div>
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); setBrasilLinksAberto(true); }}
    style={{ color: "#0000cc", textDecoration: "underline", fontWeight: "bold" }}
  >
    Brasil
  </a>
</div>
      <p style={{ marginTop: "4px" }}><strong>PIB:</strong> R$ {fmt(dadosBrasil.pib * 1000)}</p>
      <p><strong>População:</strong> {fmt(dadosBrasil.populacao)}</p>
      <p><strong>PIB per capita:</strong> R$ {dadosBrasil.perCapita.toLocaleString("pt-BR")}</p>
      <p><strong>Agropecuária:</strong> R$ {fmt(dadosBrasil.agro * 1000)}</p>
      <p><strong>Indústria:</strong> R$ {fmt(dadosBrasil.industria * 1000)}</p>
      <p><strong>Serviços:</strong> R$ {fmt(dadosBrasil.servicos * 1000)}</p>
      <p><strong>Administração pública:</strong> R$ {fmt(dadosBrasil.administracao * 1000)}</p>
      <p><strong>Impostos líquidos:</strong> R$ {fmt(dadosBrasil.impostos * 1000)}</p>
      <div><span style={{ fontSize: "11px", color: "#666", fontWeight: "normal" }}>(Indicadores econômicos: 2021 · IDH e Gini: 2010)</span></div>
    </>
  ) : regiaoSel ? (
              <>
                <div><strong>Região {NOME_REGIAO[regiaoSel]}</strong> <span style={{ fontSize: "11px", color: "#666", fontWeight: "normal" }}></span></div>
                {dadosRegiao && (
                  <>
                    <p style={{ marginTop: "4px" }}><strong>PIB:</strong> R$ {fmt(dadosRegiao.pib * 1000)}</p>
                    <p><strong>População:</strong> {fmt(dadosRegiao.populacao)}</p>
                    <p><strong>PIB per capita:</strong> R$ {dadosRegiao.perCapita.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p><strong>Agropecuária:</strong> R$ {fmt(dadosRegiao.agro * 1000)}</p>
                    <p><strong>Indústria:</strong> R$ {fmt(dadosRegiao.industria * 1000)}</p>
                    <p><strong>Serviços:</strong> R$ {fmt(dadosRegiao.servicos * 1000)}</p>
                    <p><strong>Administração pública:</strong> R$ {fmt(dadosRegiao.administracao * 1000)}</p>
                    <p><strong>Impostos líquidos:</strong> R$ {fmt(dadosRegiao.impostos * 1000)}</p>
                    <p style={{ marginTop: "10px", fontSize: "11px", color: "#666" }}>(Indicadores econômicos: 2021 · IDH e Gini: 2010)</p>
                  </>
                )}
              </>
            ) : estadoHover ? (
              <>
               <p>
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); setEstadoLinksAberto(estadoHover.sigla); }}
    style={{ color: "#0000cc", textDecoration: "underline", fontWeight: "bold" }}
  >
    {estadoHover.nome} ({estadoHover.sigla})
  </a>
  {" "}
  <span style={{ position: "relative", display: "inline-block", marginLeft: "6px" }}>
  <span
  onClick={(e) => { e.stopPropagation(); setInfoAberta(!infoAberta); }}
  style={{
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#3232e6",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "bold",
    fontFamily: "Verdana, Tahoma, sans-serif",
    lineHeight: "1",
    marginLeft: "-5px",
    verticalAlign: "middle",
  }}
>
  i
</span>
  {infoAberta && (
  <div
    style={{
      position: "absolute",
      bottom: "24px",
      left: "-20px",
      background: "#ffffff",
      border: "1px solid #000000",
      borderRadius: "8px",
      padding: "6px 10px",
      fontSize: "11px",
      whiteSpace: "nowrap",
      zIndex: 10,
      color: "#000",
      fontWeight: "normal",
    }}
  >
    Mais informações
    <div
      style={{
        position: "absolute",
        bottom: "-8px",
        left: "24px",
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: "8px solid #000000",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "-6px",
        left: "25px",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "7px solid #ffffff",
      }}
    />
  </div>
)}
</span>
</p>
                <p style={{ marginTop: "4px" }}><strong>PIB:</strong> R$ {fmt(estadoHover.pib * 1000)}</p>
                <p><strong>População:</strong> {fmt(estadoHover.populacao)}</p>
                {estadoHover.combustivel ? <p><strong>Gasolina (média):</strong> R$ {estadoHover.combustivel.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/L</p> : null}
                {estadoHover.emprego !== undefined ? (
  <p>
    <strong>Saldo de empregos (Caged - Ago/26):</strong>{" "}
    <span style={{ color: estadoHover.emprego >= 0 ? "#006400" : "#cc0000", fontWeight: "bold" }}>
      {estadoHover.emprego > 0 ? "+" : ""}{fmt(estadoHover.emprego)}
    </span>
  </p>
) : null}
                {estadoHover.ocupacao ? <p><strong>Pessoas ocupadas:</strong> {fmt(estadoHover.ocupacao)}</p> : null}
                <p><strong>PIB per capita:</strong> R$ {estadoHover.perCapita.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                {estadoHover.agro ? <p><strong>Agropecuária:</strong> R$ {fmt(estadoHover.agro * 1000)}</p> : null}
                {estadoHover.industria ? <p><strong>Indústria:</strong> R$ {fmt(estadoHover.industria * 1000)}</p> : null}
                {estadoHover.servicos ? <p><strong>Serviços:</strong> R$ {fmt(estadoHover.servicos * 1000)}</p> : null}
                {estadoHover.administracao ? <p><strong>Administração pública:</strong> R$ {fmt(estadoHover.administracao * 1000)}</p> : null}
                {estadoHover.impostos ? <p><strong>Impostos líquidos:</strong> R$ {fmt(estadoHover.impostos * 1000)}</p> : null}
                {estadoHover.importacao ? <p><strong>Importações (2026):</strong> US$ {fmt(estadoHover.importacao)}</p> : null}
                {estadoHover.exportacao ? <p><strong>Exportações (2026):</strong> US$ {fmt(estadoHover.exportacao)}</p> : null}
                {estadoHover.idh ? <p><strong>IDH:</strong> {estadoHover.idh}</p> : null}
                {estadoHover.gini ? <p><strong>Gini:</strong> {estadoHover.gini}</p> : null}
                <p style={{ marginTop: "10px", fontSize: "11px", color: "#666" }}>(Indicadores econômicos: 2021 · IDH e Gini: 2010)</p>
              </>
            ) : (
              <p>
                Clique em um estado no mapa ou em uma região ao lado para ver os indicadores.
                Todos os dados vêm de fontes públicas oficiais (IBGE, Banco Central).
              </p>
            )}
                            </div>  {/* fecha painel */}
        </div>    {/* fecha conteudo-win95-painel */}
  
      </div>      {/* fecha janela-win95 */}
    </div>        {/* fecha a caixa de 660px */}

    {/* --- 6.3 Menu Lateral (Esquerda do site) --- */}
    <div className="menu-lateral">
  <div className="menu-titulo">Menu</div>

  <a href="#" onClick={(e) => { e.preventDefault(); setModalIndicadores(true); }} className="menu-item">
    <img src="https://www.google.com/s2/favicons?domain=bcb.gov.br&sz=32" alt="" className="menu-icone" />
    Indicadores econômicos
  </a>

      <a href="#" onClick={(e) => { e.preventDefault(); setModalNoticias(true); }} className="menu-item">
        <img src="https://www.google.com/s2/favicons?domain=agenciabrasil.ebc.com.br&sz=32" alt="" className="menu-icone" />
       Notícias
      </a>

      <a href="#" onClick={(e) => { e.preventDefault(); setModalGlossario(true); }} className="menu-item">
       <img src="https://www.google.com/s2/favicons?domain=ibge.gov.br&sz=32" alt="" className="menu-icone" />
       Glossário
      </a>
    </div>

  </div> {/* fecha o flex */}

  {/* ========================================== */}
  {/*               7. RODAPÉ                    */}
  {/* ========================================== */}
      <footer className="rodape">
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("sobre"); }}>Painel Brasil</a>
  {" · "}
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("projeto"); }}>Sobre o projeto</a>
  {" · "}
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("fontes"); }}>Dados de fontes públicas</a>
  <br />
  {" · "}
<a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("termos"); }}>Termos e Licenças</a>
  <span style={{ fontSize: "10px", color: "#666", marginTop: "8px", display: "inline-block" }}>
    © 2026 Painel Brasil. Todos os direitos reservados. Proibida a reprodução sem autorização.
  </span>
</footer>
{/* ========================================== */}
{/*        8. MODAIS (Janelas que abrem)       */}
{/* ========================================== */}

{/* ---  8.1 Modal: Sobre o Painel Brasil  --- */}
{modalAberto === "sobre" && (
  <ModalCommodore onClose={() => setModalAberto(null)} />
)}
{/* ---     8.2 Modal: Sobre o Projeto     --- */}
{modalAberto === "projeto" && (
  <ModalIBM onClose={() => setModalAberto(null)} />
)}
{/* ---    8.3 Modal: Fontes dos Dados    --- */}
{modalAberto === "fontes" && (
  <ModalApple onClose={() => setModalAberto(null)} />
)}
{/* ---    8.4 Modal: Links do Estado    --- */}
{estadoLinksAberto && (
  <Modal titulo={`Mais Informações · ${estadoLinksAberto}`} onClose={() => setEstadoLinksAberto(null)}>
    {linksEstados[estadoLinksAberto] ? (
  <div>
    {[
      { chave: "governo", rotulo: "Governo estadual" },
      { chave: "prefeitura", rotulo: "Prefeitura da capital" },
      { chave: "transporte", rotulo: "Transporte público" },
    ].map((item) => {
      const url = linksEstados[estadoLinksAberto][item.chave];
      if (!url) return null;
      const dominio = new URL(url).hostname;
      return (
        <div key={item.chave} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${dominio}&sz=64`}
            alt=""
            width="32"
            height="32"
            style={{ marginRight: "10px", border: "1px solid #808080", background: "#fff" }}
          />
          <div>
            <div style={{ fontSize: "11px", color: "#444" }}>{item.rotulo}</div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0000cc", fontWeight: "bold", textDecoration: "underline" }}
            >
              {dominio} ›
            </a>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <p>Links em breve.</p>
)}
   </Modal>
)}
{/* --- 8.5 Modal: Indicadores Econômicos (Menu Lateral) --- */}
{modalIndicadores && (
  <Modal titulo="Terminal Bloomberg" onClose={() => setModalIndicadores(false)}>
    <TerminalIndicadores indicadores={indicadores} />
  </Modal>
)}
{/* --- 8.6 Modal: Termos e Licenças --- */}
{modalAberto === "termos" && (
  <Modal titulo="Termos e Licenças" onClose={() => setModalAberto(null)}>
    <p><strong>1. Natureza do projeto</strong></p>
    <p>
      O Painel Brasil é um projeto independente, experimental e sem fins lucrativos.
      Não possui vínculo com governos, partidos políticos ou instituições privadas.
      Não emite opinião política ou ideológica.
    </p>

    <p style={{ marginTop: "10px" }}><strong>2. Origem dos dados</strong></p>
    <p>
      Todos os indicadores são provenientes de fontes públicas oficiais
      (IBGE, Banco Central, Tesouro Nacional, ANP, entre outras) e são reproduzidos
      sem alteração. Cada indicador exibe a data de referência e link para a fonte original.
    </p>

    <p style={{ marginTop: "10px" }}><strong>3. Direitos autorais</strong></p>
    <p>
      O código-fonte, o design, a organização visual e a curadoria deste site são
      de autoria de Arthur Aguiar. É proibida a reprodução total ou parcial,
      por qualquer meio, sem autorização prévia por escrito. Sites inspirados no
      conceito são bem-vindos, desde que não copiem o código ou o layout.
    </p>

    <p style={{ marginTop: "10px" }}><strong>4. Dados públicos</strong></p>
    <p>
      Os dados numéricos em si (PIB, população, indicadores) são de domínio público,
      conforme a Lei de Acesso à Informação (Lei 12.527/2011) e a natureza factual
      das estatísticas oficiais. A proteção autoral recai sobre a forma de apresentação,
      não sobre os números.
    </p>

    <p style={{ marginTop: "10px" }}><strong>5. Isenção de responsabilidade</strong></p>
    <p>
      O site não se responsabiliza por decisões tomadas com base nas informações
      apresentadas. Os dados podem conter atrasos inerentes às fontes oficiais.
      Consulte sempre a fonte original antes de qualquer decisão relevante.
    </p>

    <p style={{ marginTop: "10px" }}><strong>6. Marcas e logotipos</strong></p>
    <p>
      Favicons e logotipos de terceiros exibidos no site pertencem aos seus
      respectivos proprietários e são usados apenas para identificação e link
      à fonte oficial (uso nominativo).
    </p>

        <p style={{ marginTop: "10px", fontSize: "10px", color: "#666" }}>
      Última atualização: 29/10/2026.
    </p>
    </Modal>
)}
{/* --- 8.7 Modal: Links do 'Brasil' --- */}
    {brasilLinksAberto && (
  <Modal titulo="Mais Informações · Brasil" onClose={() => setBrasilLinksAberto(false)}>
    <div>
      {[
        { chave: "governo", rotulo: "Governo Federal", url: "https://www.gov.br" },
        { chave: "camara", rotulo: "Câmara dos Deputados", url: "https://www.camara.leg.br" },
        { chave: "senado", rotulo: "Senado Federal", url: "https://www12.senado.leg.br" },
        { chave: "stf", rotulo: "Supremo Tribunal Federal", url: "https://portal.stf.jus.br" },
        { chave: "transparencia", rotulo: "Portal da Transparência", url: "https://www.portaltransparencia.gov.br" },
        { chave: "receita", rotulo: "Receita Federal", url: "https://www.gov.br/receitafederal" },
      ].map((item) => {
        const dominio = new URL(item.url).hostname;
        return (
          <div key={item.chave} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img
              src={`https://www.google.com/s2/favicons?domain=${dominio}&sz=64`}
              alt=""
              width="32"
              height="32"
              style={{ marginRight: "10px", border: "1px solid #808080", background: "#fff" }}
            />
            <div>
              <div style={{ fontSize: "11px", color: "#444" }}>{item.rotulo}</div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0000cc", fontWeight: "bold", textDecoration: "underline" }}
              >
                {dominio} ›
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </Modal>
)}
{/* --- 8.8 Modal: Notícias --- */}
{modalNoticias && (
  <Modal titulo="Navegador de Notícias" onClose={() => setModalNoticias(false)}>
    <NavegadorNoticias noticias={noticias} />
  </Modal>
)}
{/* --- 8.9 Modal: Glossário --- */}
{modalGlossario && (
  <Modal titulo="Glossário" onClose={() => setModalGlossario(false)}>
    <NotePadMac pagina={1}>
      <div style={{ padding: "10px", fontFamily: "Geneva, Verdana, sans-serif", fontSize: "13px", lineHeight: "1.4" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}></p>
        <p style={{ marginBottom: "10px" }}>Este site reúne números oficiais, mas números sozinhos não dizem muita coisa. Abaixo, uma explicação simples do que cada indicador significa.</p>
        
        <p style={{ marginBottom: "8px" }}><strong>· PIB (Produto Interno Bruto)</strong><br/>
        É a soma de tudo que o estado produz em um ano. Quanto maior, mais rica é a economia. Mas cuidado: um PIB grande não significa que a população vive bem.</p>

        <p style={{ marginBottom: "8px" }}><strong>· PIB per capita</strong><br/>
        É o PIB dividido pela população. Mostra quanto, em média, cada pessoa "produziria" se a riqueza fosse dividida igualmente. Não significa que a renda é bem distribuída.</p>

        <p style={{ marginBottom: "8px" }}><strong>· IDH (Índice de Desenvolvimento Humano)</strong><br/>
        Vai de 0 a 1. Mede saúde, educação e renda. Referência: Acima de 0,800 (muito alto) · 0,700 a 0,799 (alto) · 0,600 a 0,699 (médio) · 0,500 a 0,599 (baixo) · Abaixo de 0,500 (muito baixo).</p>

        <p style={{ marginBottom: "8px" }}><strong>· Gini (Índice de Gini)</strong><br/>
        Vai de 0 a 1. Mede a desigualdade de renda. Quanto mais perto de 0, mais igualitário. Quanto mais perto de 1, mais desigual.</p>

        <p style={{ marginBottom: "8px" }}><strong>· Setores da economia:</strong><br/>
        <p style={{ marginBottom: "8px" }}></p>
        <strong>Agropecuária:</strong> Produção agrícola e pecuária.<br/>
        <strong>Indústria:</strong> Transformação de matéria-prima.<br/>
        <strong>Serviços:</strong> Comércio, transporte, educação e saúde privada.<br/>
        <strong>Administração pública:</strong> Gastos do governo com servidores e serviços públicos.<br/>
        <strong>Impostos líquidos:</strong> Tributos arrecadados menos subsídios.</p>
      </div>
    </NotePadMac>
  </Modal>
)}
</main>
  );
}