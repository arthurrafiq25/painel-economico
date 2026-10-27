"use client";

export default function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-fundo">
      <div className="modal-janela">
        <div
          className="janela-titulo"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{titulo}</span>
          <button className="modal-botao-x" onClick={onClose} title="Fechar">
            ×
          </button>
        </div>
        <div className="modal-conteudo">
          {children}
        </div>
      </div>
    </div>
  );
}