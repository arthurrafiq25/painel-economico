"use client";

import { useState, useEffect } from "react";
import MapaBrasil from "./MapaBrasil";
import Modal from "./Modal";

const REGIOES = [
  { id: "1", nome: "• Norte" },
  { id: "2", nome: "• Nordeste" },
  { id: "3", nome: "• Sudeste" },
  { id: "4", nome: "• Centro-Oeste" },
  { id: "5", nome: "• Sul" },
];

const NOME_REGIAO = { "1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Centro-Oeste", "5": "Sul" };
const fmt = (n) => Math.round(n).toLocaleString("pt-BR");

export default function Home() {
  const [estadoHover, setEstadoHover] = useState(null);
  const [regiaoSel, setRegiaoSel] = useState(null);
  const [dadosRegiao, setDadosRegiao] = useState(null);
  const [modalAberto, setModalAberto] = useState(null);
  const [estadoLinksAberto, setEstadoLinksAberto] = useState(null);
  const [linksEstados, setLinksEstados] = useState({});
  const [infoAberta, setInfoAberta] = useState(false);

  useEffect(() => {
  fetch("/estados-links.json").then((r) => r.json()).then(setLinksEstados).catch(() => {});
}, []);

useEffect(() => {
  const fechar = () => setInfoAberta(false);
  if (infoAberta) {
    const timer = setTimeout(() => document.addEventListener("click", fechar), 0);
    return () => { clearTimeout(timer); document.removeEventListener("click", fechar); };
  }
}, [infoAberta]);

  const handleRegiao = async (id) => {
    setRegiaoSel(id);
    setEstadoHover(null);
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

  return (
    <main>
      <h1 className="titulo-pagina">Painel Brasil</h1>
      <p className="subtitulo">
        Indicadores econômicos por estado — em desenvolvimento
      </p>

      <div className="janela">
        <div className="janela-titulo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🗺️ Mapa do Brasil</span>
          {(estadoHover || regiaoSel) && (
            <button
              onClick={() => { setEstadoHover(null); handleRegiao(null); }}
              title="Limpar seleção"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                padding: "3px 7px",
                cursor: "pointer",
                background: "#d4d0c8",
                border: "1px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                fontFamily: "Verdana, Tahoma, sans-serif",
                lineHeight: "1",
              }}
            >
              ↻
            </button>
          )}
        </div>
        <div className="janela-conteudo">
          <div className="painel painel-mapa">
            <div style={{ position: "relative" }}>
              <div style={{ marginTop: "30px" }}> 
                <MapaBrasil onEstadoChange={setEstadoHover} siglaSelecionada={estadoHover ? estadoHover.sigla : null} regiaoSel={regiaoSel} />
              </div>
              <div style={{ position: "absolute", top: "80px", right: "30px", fontSize: "13px" }}> {/* MENU EMPILHADO DE REGIÕES */}
                {REGIOES.map((r) => (
                  <div key={r.nome} style={{ marginBottom: "4px" }}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleRegiao(r.id); }}
                      style={{
                        color: "#0000cc",
                        textDecoration: "underline",
                        fontWeight: regiaoSel === r.id ? "bold" : "normal",
                      }}
                    >
                      {r.nome}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "10px", left: "0", right: "0", fontSize: "12px", color: "#000080", fontWeight: "bold", textAlign: "center" }}> {/* Hover Inferior */}
              {estadoHover
                ? estadoHover.nome + " (" + estadoHover.sigla + ")" +
                  (estadoHover.info ? " · Capital: " + estadoHover.info.capital + " · Região: " + estadoHover.info.regiao + " · Fuso: " + estadoHover.info.fuso : "")
                : "Clique em um estado ou em uma região ao lado"}
            </div>
          </div>
        </div>
      </div>

      <div className="janela janela-mapa">
        <div className="janela-titulo">ℹ️ Sobre este painel</div>
        <div className="janela-conteudo">
          <div className="painel">
            {regiaoSel ? (
              <>
                <p><strong>Região {NOME_REGIAO[regiaoSel]}</strong></p>
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
                <p><strong>PIB per capita:</strong> R$ {estadoHover.perCapita.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                {estadoHover.agro ? <p><strong>Agropecuária:</strong> R$ {fmt(estadoHover.agro * 1000)}</p> : null}
                {estadoHover.industria ? <p><strong>Indústria:</strong> R$ {fmt(estadoHover.industria * 1000)}</p> : null}
                {estadoHover.servicos ? <p><strong>Serviços:</strong> R$ {fmt(estadoHover.servicos * 1000)}</p> : null}
                {estadoHover.administracao ? <p><strong>Administração pública:</strong> R$ {fmt(estadoHover.administracao * 1000)}</p> : null}
                {estadoHover.impostos ? <p><strong>Impostos líquidos:</strong> R$ {fmt(estadoHover.impostos * 1000)}</p> : null}
              </>
            ) : (
              <p>
                Clique em um estado no mapa ou em uma região ao lado para ver os indicadores.
                Todos os dados vêm de fontes públicas oficiais (IBGE, Banco Central).
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="rodape">
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("sobre"); }}>Painel Brasil</a>
  {" · "}
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("projeto"); }}>Sobre o projeto</a>
  {" · "}
  <a href="#" onClick={(e) => { e.preventDefault(); setModalAberto("fontes"); }}>Dados de fontes públicas</a>
</footer>
{modalAberto === "sobre" && (
  <Modal titulo="Painel Brasil" onClose={() => setModalAberto(null)}>
    <p>
      Projeto independente de indicadores econômicos e sociais do Brasil,
      feito por <strong>Arthur Aguiar</strong>.
    </p>
    <p style={{ marginTop: "8px" }}>
      Instagram: <a href="https://www.instagram.com/_arthuraguiar.s" target="_blank" rel="noopener noreferrer">@_arthuraguiar.s</a>
    </p>
  </Modal>
)}

{modalAberto === "projeto" && (
  <Modal titulo="Sobre o projeto" onClose={() => setModalAberto(null)}>
    <p>
      O Painel Brasil reúne indicadores econômicos e sociais oficiais do Brasil,
      por estado e por período. O objetivo é oferecer informação factual e
      imparcial, com link para a fonte original em cada dado.
    </p>
    <p style={{ marginTop: "8px" }}>
      Todos os dados vêm de fontes públicas oficiais (IBGE, Banco Central,
      Tesouro Nacional, ANP, entre outras). O projeto não tem opinião política:
      apenas apresenta os números, com data de atualização e link para a fonte.
    </p>
    <p style={{ marginTop: "8px" }}>
      Versão 0.1 — projeto em desenvolvimento.
    </p>
  </Modal>
)}

{modalAberto === "fontes" && (
  <Modal titulo="Fontes dos dados" onClose={() => setModalAberto(null)}>
    <ul style={{ listStyle: "none", padding: 0 }}>
      <li><a href="https://sidra.ibge.gov.br" target="_blank" rel="noopener noreferrer">IBGE – SIDRA</a> — PIB, população, setores</li>
      <li><a href="https://www.bcb.gov.br" target="_blank" rel="noopener noreferrer">Banco Central</a> — Selic, câmbio, crédito</li>
      <li><a href="https://www.tesourotransparente.gov.br" target="_blank" rel="noopener noreferrer">Tesouro Nacional</a> — gasto público, resultado primário</li>
      <li><a href="https://www.gov.br/anp" target="_blank" rel="noopener noreferrer">ANP</a> — preço de combustíveis</li>
      <li><a href="https://comexstat.mdic.gov.br" target="_blank" rel="noopener noreferrer">Comex Stat</a> — exportações e importações</li>
      <li><a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" target="_blank" rel="noopener noreferrer">Portal do Empreendedor</a> — MEI</li>
      <li><a href="https://www.dieese.org.br" target="_blank" rel="noopener noreferrer">DIEESE</a> — cesta básica</li>
    </ul>
  </Modal>
)}
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
    </main>
  );
}