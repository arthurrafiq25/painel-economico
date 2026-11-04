"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// ==========================================
// 1. DADOS FIXOS
// ==========================================

const GEO_URL = "/brasil-ufs.json";

// Converte a sigla (UF) para o ID numérico do IBGE.

const SIGLA_PARA_ID = {
  "RO":"11","AC":"12","AM":"13","RR":"14","PA":"15","AP":"16","TO":"17",
  "MA":"21","PI":"22","CE":"23","RN":"24","PB":"25","PE":"26","AL":"27",
  "SE":"28","BA":"29","MG":"31","ES":"32","RJ":"33","SP":"35","PR":"41",
  "SC":"42","RS":"43","MS":"50","MT":"51","GO":"52","DF":"53"
};

// Converte o nome da região para o ID numérico do IBGE

const REGIAO_NOME_PARA_ID = { "Norte": "1", "Nordeste": "2", "Sudeste": "3", "Centro-Oeste": "4", "Sul": "5" };

// ==========================================
// Função principal do componente 'MapaBrasil' (Estado, Sigla e Região).
// ==========================================

export default function MapaBrasil({ onEstadoChange, siglaSelecionada, regiaoSel }) {

  // ==========================================
  // 2. ESTADOS (const)
  // ==========================================

  const [pib, setPib] = useState({});
  const [populacao, setPopulacao] = useState({});
  const [perCapita, setPerCapita] = useState({});
  const [info, setInfo] = useState({});
  const [agro, setAgro] = useState({});
  const [industria, setIndustria] = useState({});
  const [servicos, setServicos] = useState({});
  const [administracao, setAdministracao] = useState({});
  const [impostos, setImpostos] = useState({});
  const [idhGini, setIdhGini] = useState({});
  const [ocupacao, setOcupacao] = useState({});
  const [combustivel, setCombustivel] = useState({});
  const [emprego, setEmprego] = useState({});
  const [exportacoes, setExportacoes] = useState({});
  const [importacoes, setImportacoes] = useState({});

  // ==========================================
  // 3. EFEITOS (fetch)
  // ==========================================

  useEffect(() => {
    fetch("/pib-uf.json").then((r) => r.json()).then(setPib).catch(() => {});
    fetch("/populacao-uf.json").then((r) => r.json()).then(setPopulacao).catch(() => {});
    fetch("/pib-per-capita-uf.json").then((r) => r.json()).then(setPerCapita).catch(() => {});
    fetch("/estados-info.json").then((r) => r.json()).then(setInfo).catch(() => {});
    fetch("/agropecuaria-uf.json").then((r) => r.json()).then(setAgro).catch(() => {});
    fetch("/industria-uf.json").then((r) => r.json()).then(setIndustria).catch(() => {});
    fetch("/servicos-uf.json").then((r) => r.json()).then(setServicos).catch(() => {});
    fetch("/administracao-uf.json").then((r) => r.json()).then(setAdministracao).catch(() => {});
    fetch("/impostos-uf.json").then((r) => r.json()).then(setImpostos).catch(() => {});
    fetch("/idh-gini.json").then((r) => r.json()).then(setIdhGini).catch(() => {});
    fetch("/ocupacao-uf.json").then((r) => r.json()).then(setOcupacao).catch(() => {});
    fetch("/combustiveis.json").then((r) => r.json()).then(setCombustivel).catch(() => {});
    fetch("/emprego.json").then((r) => r.json()).then(setEmprego).catch(() => {});
    fetch("/exportacoes.json").then((r) => r.json()).then(setExportacoes).catch(() => {});
    fetch("/importacoes.json").then((r) => r.json()).then(setImportacoes).catch(() => {});
  }, []);

  // ==========================================
  // 4. FUNÇÕES AUXILIARES
  // ==========================================
  
  // Função que descobre a qual região o estado pertence, baseado na sigla

  const regiaoDoEstado = (sigla) => {
    const i = info[SIGLA_PARA_ID[sigla]];
    return i ? REGIAO_NOME_PARA_ID[i.regiao] : null;
  };

  // ==========================================
  // 5. RENDERIZAÇÃO DO MAPA (ComposableMap, Geographies, Geography)
  // ==========================================

  return (
    <div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 400, center: [-55, -15] }}
        width={400}
        height={300}
        style={{ width: "100%", maxWidth: "550px", height: "auto", display: "block", margin: "0", marginLeft: "-20px" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nome = geo.properties.Estado || geo.properties.name || "UF";
              const sigla = geo.properties.SIGLA || "";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{ outline: "none" }}

                  // Cor do estado ao selecionar região.

                  fill={
                    regiaoSel
                      ? (regiaoDoEstado(sigla) === regiaoSel ? "#000080" : "#c8c8c8")
                      : (siglaSelecionada === sigla ? "#000080" : "#728E6D")
                  }

                  // Infos do 'Painel' na ordem exata

                  stroke="#ffffff"
                  strokeWidth={1}
                  onClick={() => onEstadoChange({ 
                    nome, 
                    sigla, 
                    id: geo.id, 
                    pib: pib[SIGLA_PARA_ID[sigla]], 
                    populacao: populacao[SIGLA_PARA_ID[sigla]], 
                    perCapita: perCapita[SIGLA_PARA_ID[sigla]], 
                    info: info[SIGLA_PARA_ID[sigla]], 
                    agro: agro[SIGLA_PARA_ID[sigla]], 
                    industria: industria[SIGLA_PARA_ID[sigla]], 
                    servicos: servicos[SIGLA_PARA_ID[sigla]], 
                    administracao: administracao[SIGLA_PARA_ID[sigla]], 
                    impostos: impostos[SIGLA_PARA_ID[sigla]],
                    idh: idhGini[SIGLA_PARA_ID[sigla]]?.idh, 
                    gini: idhGini[SIGLA_PARA_ID[sigla]]?.gini,
                    ocupacao: ocupacao[SIGLA_PARA_ID[sigla]],
                    combustivel: combustivel[SIGLA_PARA_ID[sigla]],
                    emprego: emprego[SIGLA_PARA_ID[sigla]],
                    exportacao: exportacoes[SIGLA_PARA_ID[sigla]],
                    importacao: importacoes[SIGLA_PARA_ID[sigla]]
                  })}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Configuração do Rodapé do mapa (Hover inferior) */}
      <div style={{ marginTop: "8px", fontSize: "12px", color: "#000080", fontWeight: "bold", minHeight: "20px", textAlign: "center" }}>
      </div>
    </div>
  );
}