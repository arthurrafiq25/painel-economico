"use client";

import { useState } from "react";
import MapaBrasil from "./MapaBrasil";

export default function Home() {
  const [estadoHover, setEstadoHover] = useState(null);

  return (
    <main>
      <h1 className="titulo-pagina">Painel Brasil</h1>
      <p className="subtitulo">
        Indicadores econômicos por estado — em desenvolvimento
      </p>

      <div className="janela">
        <div className="janela-titulo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <span>🗺️ Mapa do Brasil</span>
  {estadoHover && (
    <button
  onClick={() => setEstadoHover(null)}
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
            <MapaBrasil onEstadoChange={setEstadoHover} siglaSelecionada={estadoHover ? estadoHover.sigla : null} />
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#000080", fontWeight: "bold", minHeight: "20px", textAlign: "center" }}>
              {estadoHover
                ? estadoHover.nome + " (" + estadoHover.sigla + ")" +
                  (estadoHover.info ? " · Capital: " + estadoHover.info.capital + " · Região: " + estadoHover.info.regiao + " · Fuso: " + estadoHover.info.fuso : "")
                : "Passe o mouse sobre um estado"}
            </div>
          </div>
        </div>
      </div>

      <div className="janela janela-mapa">
        <div className="janela-titulo">ℹ️ Sobre este painel</div>
        <div className="janela-conteudo">
          <div className="painel">
            {estadoHover ? (
              <>
                <p><strong>{estadoHover.nome} ({estadoHover.sigla})</strong></p>
                <p style={{ marginTop: "4px" }}>
                  {estadoHover.pib ? "PIB: R$ " + Math.round(estadoHover.pib / 1000).toLocaleString("pt-BR") + " milhões" : ""}
                </p>
                <p>
                  {estadoHover.populacao ? "População: " + estadoHover.populacao.toLocaleString("pt-BR") : ""}
                </p>
                <p>
                  {estadoHover.perCapita ? "PIB per capita: R$ " + estadoHover.perCapita.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                </p>
              </>
            ) : (
              <p>
                Passe o mouse sobre um estado no mapa para ver os indicadores.
                Todos os dados vêm de fontes públicas oficiais (IBGE, Banco Central).
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="rodape">
        Painel Brasil · Projeto experimental · Dados de fontes públicas oficiais
      </footer>
    </main>
  );
}