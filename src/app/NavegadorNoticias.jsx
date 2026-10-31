"use client";

import { useRef, useState } from "react";

const URL_PADRAO = "http://www.agenciabrasil.ebc.com.br";
const STATUS_PADRAO = "Concluído";
const NOME_PORTAL_PADRAO = "Portal de Notícias";
const N_DESTAQUES = 3; // matérias logo abaixo da manchete

const ATALHOS = [
  { rotulo: "Governo", href: "https://www.gov.br" },
  { rotulo: "IBGE", href: "https://www.ibge.gov.br" },
  { rotulo: "Agência Brasil", href: "https://agenciabrasil.ebc.com.br" },
];

// Brasil primeiro, depois as 26 UFs + DF em ordem alfabética.
// O "valor" é a chave usada no JSON de notícias.
const REGIOES = [
  { valor: "BR", nome: "Brasil" },
  { valor: "AC", nome: "Acre" },
  { valor: "AL", nome: "Alagoas" },
  { valor: "AP", nome: "Amapá" },
  { valor: "AM", nome: "Amazonas" },
  { valor: "BA", nome: "Bahia" },
  { valor: "CE", nome: "Ceará" },
  { valor: "DF", nome: "Distrito Federal" },
  { valor: "ES", nome: "Espírito Santo" },
  { valor: "GO", nome: "Goiás" },
  { valor: "MA", nome: "Maranhão" },
  { valor: "MT", nome: "Mato Grosso" },
  { valor: "MS", nome: "Mato Grosso do Sul" },
  { valor: "MG", nome: "Minas Gerais" },
  { valor: "PA", nome: "Pará" },
  { valor: "PB", nome: "Paraíba" },
  { valor: "PR", nome: "Paraná" },
  { valor: "PE", nome: "Pernambuco" },
  { valor: "PI", nome: "Piauí" },
  { valor: "RJ", nome: "Rio de Janeiro" },
  { valor: "RN", nome: "Rio Grande do Norte" },
  { valor: "RS", nome: "Rio Grande do Sul" },
  { valor: "RO", nome: "Rondônia" },
  { valor: "RR", nome: "Roraima" },
  { valor: "SC", nome: "Santa Catarina" },
  { valor: "SP", nome: "São Paulo" },
  { valor: "SE", nome: "Sergipe" },
  { valor: "TO", nome: "Tocantins" },
];

// Aceita "2026-10-30", "2026-10-30T12:00:00Z" ou texto já formatado.
// Datas só com dia são tratadas à mão para não "voltar um dia" por fuso horário.
function formatarData(valor) {
  if (!valor) return "";
  const texto = String(valor);
  const simples = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (simples) return `${simples[3]}/${simples[2]}/${simples[1]}`;
  const d = new Date(texto);
  return Number.isNaN(d.getTime()) ? texto : d.toLocaleDateString("pt-BR");
}

// "Sexta-feira, 30 de outubro de 2026"
function dataPorExtenso() {
  const t = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// Tela Home padrão (provisória). Para usar a sua, passe a prop `telaHome`.
function HomePadrao({ nomePortal }) {
  return (
    <div className="nav-home-padrao">
      <h1 className="nav-home-padrao-titulo">{nomePortal}</h1>
      <p>Selecione uma região no menu acima para ver as notícias.</p>
    </div>
  );
}

// Home em imagem (a sua montagem). Se a imagem não carregar, mostra a home padrão.
function HomeImagem({ src, alt, ajuste, fallback }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return fallback;
  return (
    <div className="nav-home-foto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="nav-home-foto-img"
        src={src}
        alt={alt}
        style={{ objectFit: ajuste }}
        onError={() => setFalhou(true)}
      />
    </div>
  );
}

// Ícone clássico de "casinha" (pixel art, 16x16)
function IconeHome() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="3.5" y="7.5" width="9" height="7" fill="#f0e2a0" stroke="#000" />
      <path d="M8 1.5 1.5 8.5H14.5Z" fill="#c00000" stroke="#000" />
      <rect x="7.5" y="10.5" width="2" height="4" fill="#804000" stroke="#000" />
    </svg>
  );
}

/**
 * Conteúdo do modal de notícias, no estilo de um navegador antigo.
 *
 * `noticias` é um objeto com uma chave por região:
 *   { BR: [ { titulo, resumo, link, data, fonte?, categoria? }, ... ], SP: [ ... ] }
 * A 1ª matéria de cada lista vira a manchete; as 3 seguintes, destaques;
 * o restante vai para a coluna "Últimas notícias".
 * (uma lista simples também é aceita e vira "BR", por compatibilidade)
 *
 * O modal abre na tela HOME (sem região escolhida). O botão "Home" e a opção
 * "Selecione..." do dropdown voltam para ela.
 * `telaHome` (opcional): seu próprio design da tela home. Pode ser um elemento
 * (<MinhaHome />) ou uma função ({ irParaRegiao }) => <MinhaHome ... />.
 *
 * Uso:
 *   <Modal titulo="Navegador de Notícias" onClose={...}>
 *     <NavegadorNoticias noticias={noticias} nomePortal="Nome do seu site" telaHome={<MinhaHome />} />
 *   </Modal>
 */
export default function NavegadorNoticias({
  noticias = {},
  nomePortal = NOME_PORTAL_PADRAO,
    telaHome = null,
  imagemHome = null,
  imagemHomeAjuste = "cover",
  imagemHomeAlt = "Tela inicial do portal de notícias",
}) {

  const [status, setStatus] = useState(STATUS_PADRAO);
  const [regiao, setRegiao] = useState(""); // "" = tela Home
  const [selecionado, setSelecionado] = useState(null); // índice na lista atual
  const paginaRef = useRef(null);

  const mostrar = (texto) => setStatus(texto);
  const limpar = () => setStatus(STATUS_PADRAO);

  const porRegiao = Array.isArray(noticias) ? { BR: noticias } : noticias || {};
  const lista = Array.isArray(porRegiao[regiao]) ? porRegiao[regiao] : [];
  const nomeRegiao = REGIOES.find((r) => r.valor === regiao)?.nome ?? regiao;
  const emHome = regiao === "";

  // Endereço mostrado na barra: link da notícia selecionada, ou o padrão
  const noticiaAtual = selecionado !== null ? lista[selecionado] : null;
  const urlEndereco = noticiaAtual?.link || URL_PADRAO;

  const irParaRegiao = (valor) => {
    setRegiao(valor);
    setSelecionado(null); // volta o endereço para o padrão
    setStatus(STATUS_PADRAO);
    // nova edição (ou a home) começa sempre do topo
    if (paginaRef.current) paginaRef.current.scrollTop = 0;
  };

  const irParaHome = () => irParaRegiao("");

  // Estrutura do portal: manchete, destaques e "últimas"
  const manchete = lista[0];
  const destaques = lista.slice(1, 1 + N_DESTAQUES);
  const ultimas = lista.slice(1 + N_DESTAQUES);

  // Atalhos de edição: só as regiões que realmente têm notícias no JSON
  const edicoes = REGIOES.filter(
    (r) => Array.isArray(porRegiao[r.valor]) && porRegiao[r.valor].length > 0
  );

  // Conteúdo da tela Home: telaHome > imagemHome > padrão
  const homePadrao = <HomePadrao nomePortal={nomePortal} />;
  let conteudoHome;
  if (typeof telaHome === "function") {
    conteudoHome = telaHome({ irParaRegiao });
  } else if (telaHome) {
    conteudoHome = telaHome;
  } else if (imagemHome) {
    conteudoHome = (
      <HomeImagem
        src={imagemHome}
        alt={imagemHomeAlt}
        ajuste={imagemHomeAjuste}
        fallback={homePadrao}
      />
    );
  } else {
    conteudoHome = homePadrao;
  }

  // Uma matéria clicável (seleciona e atualiza a barra de endereço)
  const renderMateria = (n, i, variante) => {
    const resumo = n.resumo ?? n.descricao;
    const info = [formatarData(n.data), n.fonte].filter(Boolean).join(" - ");
    return (
      <button
        type="button"
        className={`pt-materia pt-${variante}`}
        aria-pressed={selecionado === i}
        onClick={() => setSelecionado(i)}
        onMouseEnter={() => n.link && mostrar(n.link)}
        onMouseLeave={limpar}
        onFocus={() => n.link && mostrar(n.link)}
        onBlur={limpar}
      >
        <span className="pt-texto">
          {n.categoria && <span className="pt-tag">{n.categoria}</span>}
          <span className="pt-titulo">{n.titulo}</span>
          {resumo && variante !== "ultima" && (
            <span className="pt-resumo">{resumo}</span>
          )}
          {info && <span className="pt-meta">{info}</span>}
        </span>
      </button>
    );
  };

  return (
    <div className="nav-antigo">
      {/* Topo: duas barras empilhadas + gif animado à direita */}
      <div className="nav-topo">
        <div className="nav-topo-barras">
          <div className="nav-barra">
            <span className="nav-alca" aria-hidden="true" />
            {ATALHOS.map((a) => (
              <a
                key={a.rotulo}
                className="nav-botao"
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => mostrar(a.href)}
                onMouseLeave={limpar}
                onFocus={() => mostrar(a.href)}
                onBlur={limpar}
              >
                {a.rotulo}
              </a>
            ))}
          </div>

          <div className="nav-barra">
            <span className="nav-alca" aria-hidden="true" />
            <span className="nav-rotulo">Endereço</span>
            <a
              className="nav-campo"
              href={urlEndereco}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em nova aba"
            >
              <span className="nav-icone" aria-hidden="true">
                📄
              </span>
              <span className="nav-url">{urlEndereco}</span>
            </a>

            <button
              type="button"
              className="nav-botao nav-botao-home"
              onClick={irParaHome}
              title="Voltar para a tela inicial"
            >
              <IconeHome />
              Home
            </button>

            <label className="nav-rotulo" htmlFor="nav-regiao">
              Região
            </label>
            <select
              id="nav-regiao"
              className="nav-select"
              value={regiao}
              onChange={(e) => irParaRegiao(e.target.value)}
            >
              <option value="">Selecione...</option>
              {REGIOES.map((r) => (
                <option key={r.valor} value={r.valor}>
                  {r.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* O arquivo fica em /public/throbber-economia.gif */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="nav-gif"
          src="/noticias.gif"
          width={76}
          height={48}
          alt=""
        />
      </div>

      {/* Página: tela Home (descanso) ou portal da região escolhida */}
      <div
        className={`nav-pagina${emHome ? " nav-pagina-home" : ""}`}
        tabIndex={0}
        ref={paginaRef}
      >
        {emHome ? (
                    <div className="nav-home">{conteudoHome}</div>
        ) : (
          <>
            <header className="pt-cabecalho">
              <div className="pt-faixa">
                <span>{dataPorExtenso()}</span>
                <span>
                  {lista.length} {lista.length === 1 ? "matéria" : "matérias"}{" "}
                  nesta edição
                </span>
              </div>

              <div className="pt-marca">
                <h1 className="pt-nome">{nomePortal}</h1>
                <span className="pt-edicao">{nomeRegiao}</span>
              </div>

              {edicoes.length > 1 && (
                <nav className="pt-edicoes" aria-label="Edições por região">
                  <span className="pt-edicoes-rotulo">Edições:</span>
                  {edicoes.map((r) => (
                    <button
                      key={r.valor}
                      type="button"
                      className="pt-edicao-link"
                      title={r.nome}
                      aria-current={r.valor === regiao ? "page" : undefined}
                      onClick={() => irParaRegiao(r.valor)}
                    >
                      {r.valor === "BR" ? "Brasil" : r.valor}
                    </button>
                  ))}
                </nav>
              )}
            </header>

            {!manchete ? (
              <p className="pt-vazio">
                Nenhuma notícia disponível para {nomeRegiao} no momento.
              </p>
            ) : (
              <div
                className={`pt-corpo${ultimas.length ? "" : " pt-corpo-unico"}`}
              >
                <div className="pt-principal">
                  <section className="pt-manchete-bloco" aria-label="Manchete">
                    {renderMateria(manchete, 0, "manchete")}
                  </section>

                  {destaques.length > 0 && (
                    <section className="pt-destaques" aria-label="Destaques">
                      {destaques.map((n, k) => (
                        <div key={n.link || n.titulo || k}>
                          {renderMateria(n, 1 + k, "destaque")}
                        </div>
                      ))}
                    </section>
                  )}
                </div>

                {ultimas.length > 0 && (
                  <aside className="pt-ultimas" aria-label="Últimas notícias">
                    <h2 className="pt-ultimas-titulo">Últimas notícias</h2>
                    <ul>
                      {ultimas.map((n, k) => (
                        <li key={n.link || n.titulo || k}>
                          {renderMateria(n, 1 + N_DESTAQUES + k, "ultima")}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Barra de status: mostra o endereço do link sob o mouse */}
      <div className="nav-status">
        <span className="nav-status-texto">{status}</span>
        <span className="nav-status-zona">🌐 Internet</span>
      </div>
    </div>
  );
}