"use client";

// ✏️ PERSONALIZE AQUI ------------------------------------------------------
const NOME_TERMINAL = "TERMINAL MACRO 1520"; // texto da carcaça (canto superior esquerdo)
const SELO = "286"; // plaquinha no canto superior direito
const TITULO = "SISTEMA DE INDICADORES MACRO";
const PAIS = "BRASIL";
const RODAPE = "FIM DA TRANSMISSÃO";

// Uma linha por indicador. "chave" é o nome da propriedade em `indicadores`.
// prefixo/sufixo são opcionais (ex.: sufixo: "%" ou prefixo: "R$ "), caso o
// valor chegue sem a unidade. Deixe vazio se o dado já vem formatado.
const LINHAS = [
  { chave: "selic", codigo: "SELIC", rotulo: "TAXA SELIC", rotuloData: "DATA", prefixo: "", sufixo: "" },
  { chave: "ipca", codigo: "IPCA", rotulo: "INFLAÇÃO (IPCA)", rotuloData: "DATA", prefixo: "", sufixo: "" },
  { chave: "cambio", codigo: "USD", rotulo: "DÓLAR (USD/BRL)", rotuloData: "DATA", prefixo: "", sufixo: "" },
  { chave: "desemprego", codigo: "DESEMP.", rotulo: "TAXA DE DESEMPREGO", rotuloData: "PERÍODO", prefixo: "", sufixo: "" },
  { chave: "salario", codigo: "SAL.MIN", rotulo: "SALÁRIO MÍNIMO", rotuloData: "VIGÊNCIA", prefixo: "", sufixo: "" },
  { chave: "ipcaAlimentacao", codigo: "ALIM.", rotulo: "IPCA ALIMENTAÇÃO", rotuloData: "MÊS", prefixo: "", sufixo: "" },
];
// --------------------------------------------------------------------------

// Lê um indicador sem alterar o dado: { valor, data } ou { valor, periodo }.
// Também aceita o indicador como valor simples (sem data).
function ler(item) {
  if (item === null || item === undefined) return { valor: null, quando: null };
  if (typeof item !== "object") return { valor: item, quando: null };
  return { valor: item.valor ?? null, quando: item.data ?? item.periodo ?? null };
}

const vazio = (v) => v === null || v === undefined || v === "";

/**
 * Terminal de indicadores (estética de terminal financeiro dos anos 80).
 *
 * `indicadores`: {
 *   selic:      { valor, data },
 *   ipca:       { valor, data },
 *   cambio:     { valor, data },
 *   desemprego: { valor, periodo }
 * }
 * `piscar`: true = cursor do rodapé pisca; false = estático.
 *
 * Uso:
 *   <Modal titulo="Indicadores" onClose={...}>
 *     <TerminalIndicadores indicadores={indicadores} />
 *   </Modal>
 */
export default function TerminalIndicadores({ indicadores = {}, piscar = true }) {
  const dados = indicadores || {};

  return (
    <div className="tm-carcaca">
      {/* Barra de título: a "carcaça" do monitor */}
      <div className="tm-topo">
        <span className="tm-modelo">{NOME_TERMINAL}</span>
        <span className="tm-led" aria-hidden="true" />
        <span className="tm-selo" aria-hidden="true">
          {SELO}
        </span>
      </div>

      {/* Tela CRT */}
      <div className="tm-tela">
        <div className="tm-conteudo">
          <header className="tm-cabecalho">
            <span>{TITULO}</span>
            <span>{PAIS}</span>
          </header>

          <ul className="tm-lista">
            {LINHAS.map((l) => {
              const { valor, quando } = ler(dados[l.chave]);
              const valorTxt = vazio(valor) ? "---" : `${l.prefixo}${valor}${l.sufixo}`;
              return (
                <li className="tm-linha" key={l.chave}>
                  <span className="tm-codigo">{l.codigo}</span>
                  <span className="tm-rotulo">{l.rotulo}</span>
                  <span className="tm-valor">{valorTxt}</span>
                  <span className="tm-quando">
                    <span className="tm-quando-rotulo">{l.rotuloData}</span>{" "}
                    {vazio(quando) ? "---" : String(quando)}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="tm-rodape">
            {RODAPE}
            <span className={`tm-cursor${piscar ? " tm-piscar" : ""}`} aria-hidden="true">
              {" "}█
            </span>
          </p>
        </div>

        {/* Efeito de linhas de varredura + vinheta (só decoração) */}
        <div className="tm-scanlines" aria-hidden="true" />
      </div>

      <div className="tm-base" aria-hidden="true" />
    </div>
  );
}