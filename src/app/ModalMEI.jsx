"use client";

export default function ModalMEI({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      
      {/* Janela Estilo Chatoom Compacta */}
      <div style={{ width: "450px", maxWidth: "95%", backgroundColor: "#FF6600", border: "2px solid #000000", display: "flex", flexDirection: "column", boxShadow: "6px 6px 0px rgba(0,0,0,0.6)" }}>
        
        {/* Barra de Título Preta */}
        <div style={{ backgroundColor: "#000000", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 6px", fontFamily: "Verdana, sans-serif", fontSize: "12px", fontWeight: "bold" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            💬 Guia do Empreendedor
          </span>
          <button 
            onClick={onClose}
            style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #000", width: "16px", height: "16px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: "bold", cursor: "pointer", padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Conteúdo Interno */}
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Caixinha de Texto (Estilo Janela de Chat) */}
          <div style={{ backgroundColor: "#FF6600", border: "0px inset #808080", padding: "12px", fontFamily: "Verdana, sans-serif", fontSize: "12px", color: "#000", lineHeight: "1.5" }}>
            
            <div style={{ fontWeight: "bold", marginBottom: "8px", borderBottom: "1px solid #ccc", paddingBottom: "4px", color: "#FFFFFF" }}>
              
            </div>

            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Teto de Faturamento MEI:</strong><br/>
              R$ 81.000,00 / ano
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Valor do DAS mensal:</strong><br/>
              R$ 75,90 (comércio e serviços)
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Teto do Simples Nacional:</strong><br/>
              R$ 4.800.000,00 / ano
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Salário Mínimo:</strong><br/>
              R$ 1.621,00
            </p>

            <div style={{ fontSize: "10px", color: "#666", marginTop: "12px", borderTop: "1px dashed #ccc", paddingTop: "6px" }}>
              Fonte: Portal do Empreendedor / Receita Federal.<br/>
              Última verificação: Nov/2026.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}