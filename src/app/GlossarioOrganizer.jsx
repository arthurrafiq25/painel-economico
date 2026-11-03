"use client";

export default function GlossarioOrganizer({ onClose }) {
  return (
    // Fundo do "Desktop" do Mac OS Clássico (padrão de listras cinzas)
    <div style={{ 
      position: "fixed", 
      top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: "#888888", 
      backgroundImage: "repeating-linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%, #777), repeating-linear-gradient(45deg, #777 25%, #888 25%, #888 75%, #777 75%, #777)", 
      backgroundPosition: "0 0, 10px 10px", 
      backgroundSize: "20px 20px",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      
      {/* A Janela do Mac OS */}
      <div style={{ 
        width: "100%", 
        maxWidth: "650px", 
        height: "480px", 
        backgroundColor: "#ffffff", 
        border: "1px solid #000000", 
        display: "flex", 
        flexDirection: "column",
        boxShadow: "3px 3px 0px rgba(0,0,0,0.6)",
        fontFamily: "'Chicago', 'Geneva', 'Helvetica', sans-serif"
      }}>
        
        {/* Barra de Título Listrada (Mac OS) */}
        <div style={{ 
          borderBottom: "1px solid #000000", 
          display: "flex", 
          alignItems: "center", 
          padding: "1px", 
          background: "#ffffff",
          height: "24px"
        }}>
          {/* Botão de Fechar (Caixa quadrada) */}
          <div 
            onClick={onClose}
            style={{ 
              width: "14px", height: "14px", 
              border: "1px solid #000", 
              margin: "0 4px", 
              cursor: "pointer",
              backgroundColor: "#fff"
            }}
          ></div>
          
          {/* Faixas listradas + Título no meio */}
          <div style={{ 
            flex: 1, 
            height: "100%", 
            backgroundImage: "repeating-linear-gradient(to bottom, #fff, #fff 1px, #000 1px, #000 2px)", 
            borderTop: "1px solid #000", 
            borderBottom: "1px solid #000",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            marginRight: "4px"
          }}>
            <span style={{ 
              backgroundColor: "#fff", 
              padding: "0 10px", 
              fontSize: "13px", 
              fontWeight: "bold", 
              lineHeight: "14px",
              color: "#000"
            }}>
              Note Pad - Glossário
            </span>
          </div>
        </div>

        {/* Área de Texto */}
        <div style={{ 
          flex: 1, 
          padding: "12px 16px", 
          overflowY: "auto", 
          fontSize: "14px", 
          lineHeight: "1.5",
          borderBottom: "1px solid #000000",
          color: "#000"
        }}>
          
          <p style={{ fontWeight: "bold", marginBottom: "16px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
            COMO LER OS DADOS
          </p>
          
          <p style={{ marginBottom: "16px" }}>Este site reúne números oficiais, mas números sozinhos não dizem muita coisa. Abaixo, uma explicação simples do que cada indicador significa.</p>

          <p style={{ marginBottom: "8px" }}><strong>PIB (Produto Interno Bruto)</strong><br/>
          É a soma de tudo que o estado produz em um ano. Quanto maior, mais rica é a economia. Mas cuidado: um PIB grande não significa que a população vive bem.</p>

          <p style={{ marginBottom: "8px" }}><strong>PIB per capita</strong><br/>
          É o PIB dividido pela população. Mostra quanto, em média, cada pessoa "produziria" se a riqueza fosse dividida igualmente. Não significa que a renda é bem distribuída.</p>

          <p style={{ marginBottom: "8px" }}><strong>IDH (Índice de Desenvolvimento Humano)</strong><br/>
          Vai de 0 a 1. Mede saúde, educação e renda. Referência: Acima de 0,800 (muito alto) · 0,700 a 0,799 (alto) · 0,600 a 0,699 (médio) · 0,500 a 0,599 (baixo) · Abaixo de 0,500 (muito baixo).</p>

          <p style={{ marginBottom: "8px" }}><strong>Gini (Índice de Gini)</strong><br/>
          Vai de 0 a 1. Mede a desigualdade de renda. Quanto mais perto de 0, mais igualitário. Quanto mais perto de 1, mais desigual.</p>

          <p style={{ marginBottom: "8px" }}><strong>Setores da economia</strong><br/>
          <strong>Agropecuária:</strong> Produção agrícola e pecuária.<br/>
          <strong>Indústria:</strong> Transformação de matéria-prima.<br/>
          <strong>Serviços:</strong> Comércio, transporte, educação e saúde privada.<br/>
          <strong>Administração pública:</strong> Gastos do governo com servidores e serviços públicos.<br/>
          <strong>Impostos líquidos:</strong> Tributos arrecadados menos subsídios.</p>

          {/* Cursor falso piscando no final */}
          <span style={{ display: "inline-block", width: "8px", height: "14px", backgroundColor: "#000", animation: "piscar 1s step-end infinite", verticalAlign: "middle" }}></span>
          
          <style>{`
            @keyframes piscar {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </div>

        {/* Barra de Status Inferior (Mac OS) */}
        <div style={{ padding: "4px 8px", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "24px" }}>
          <div></div> 
          <div style={{ fontWeight: "bold" }}>1</div> 
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ width: "16px", height: "16px", border: "1px solid #000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", cursor: "pointer" }}>▲</div>
            <div style={{ width: "16px", height: "16px", border: "1px solid #000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", cursor: "pointer" }}>▼</div>
          </div>
        </div>

      </div>
    </div>
  );
}