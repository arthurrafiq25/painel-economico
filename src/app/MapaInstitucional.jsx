"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ==========================================================================
   PERSONALIZE AQUI
   ========================================================================== */
const CORES_PODER = {
  executivo: "#3b6fe0",
  legislativo: "#14a38b",
  judiciario: "#e8892b",
  outro: "#7a8699",
};

const ROTULOS_PODER = {
  executivo: "Executivo",
  legislativo: "Legislativo",
  judiciario: "Judiciário",
};

const MAPA = {
  espessuraLinha: 2.5,
  animarLinhas: false,
  grade: { mostrar: true, gap: 28, cor: "rgba(110, 95, 75, 0.05)" },
  mostrarControles: true,
  mostrarBotaoBloqueio: false,
  mostrarMiniMapa: true,
  arrastarCartoes: false,
  reajustarAoRedimensionar: true,
  zoomMinimo: 0.25,
  zoomMaximo: 1.8,
  zoomMinimoNoAjuste: 0.6,
};

const OPCOES_AJUSTE = { padding: 0.15, minZoom: MAPA.zoomMinimoNoAjuste };

/* ==========================================================================
   CARTÃO (nó customizado)
   ========================================================================== */
function CartaoNo({ data }) {
  const cor = CORES_PODER[data.tipo] || CORES_PODER.outro;
  return (
    <div className={data.raiz ? "mapa-no mapa-no-raiz" : "mapa-no"} style={{ "--cor-no": cor }}>
      <Handle type="target" position={Position.Top} className="mapa-handle" isConnectable={false} />
      {!data.raiz && data.tipo && ROTULOS_PODER[data.tipo] && (
        <span className="mapa-no-tipo">{ROTULOS_PODER[data.tipo]}</span>
      )}
      <span className="mapa-no-titulo">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="mapa-handle" isConnectable={false} />
    </div>
  );
}

const nodeTypes = { institucional: CartaoNo };

/* ==========================================================================
   AJUSTE AUTOMÁTICO
   ========================================================================== */
function AjusteAutomatico() {
  const { fitView } = useReactFlow();
  const dom = useStore((s) => s.domNode);

  useEffect(() => {
    if (!MAPA.reajustarAoRedimensionar || !dom || typeof ResizeObserver === "undefined") return undefined;
    let t;
    let primeira = true;
    const ro = new ResizeObserver(() => {
      if (primeira) { primeira = false; return; }
      clearTimeout(t);
      t = setTimeout(() => fitView({ ...OPCOES_AJUSTE, duration: 200 }), 150);
    });
    ro.observe(dom);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [dom, fitView]);

  return null;
}

/* ==========================================================================
   MAPA
   ========================================================================== */
export default function MapaInstitucional() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetch("/orgaos.json")
      .then((r) => r.json())
      .then((d) => {
        setNodes(d.nodes);
        
        const edgesComCor = d.edges.map((e) => {
          const alvo = d.nodes.find((n) => n.id === e.target);
          const cor = CORES_PODER[alvo?.data?.tipo] || CORES_PODER.outro;
          return {
            ...e,
            type: "default",
            animated: MAPA.animarLinhas,
            style: { stroke: cor, strokeWidth: MAPA.espessuraLinha, strokeLinecap: "round" },
          };
        });
        
        setEdges(edgesComCor);
      })
      .catch((e) => console.error("Erro ao carregar órgãos:", e));
  }, [setNodes]);

  const onNodeClick = useCallback((event, node) => {
    alert(`Clicou em: ${node.data.label}`);
  }, []);

  return (
    <div className="mapa-inst">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        nodesDraggable={MAPA.arrastarCartoes}
        nodesConnectable={false}
        minZoom={MAPA.zoomMinimo}
        maxZoom={MAPA.zoomMaximo}
        fitView
        fitViewOptions={OPCOES_AJUSTE}
        attributionPosition="bottom-center"
      >
        {MAPA.grade.mostrar && (
          <Background variant={BackgroundVariant.Lines} gap={MAPA.grade.gap} lineWidth={1} color={MAPA.grade.cor} />
        )}
        {MAPA.mostrarControles && <Controls showInteractive={MAPA.mostrarBotaoBloqueio} />}
        {MAPA.mostrarMiniMapa && (
          <MiniMap
            pannable
            zoomable
            style={{ width: 130, height: 90 }}
            maskColor="rgba(235, 229, 214, 0.55)"
            nodeStrokeWidth={0}
            nodeBorderRadius={4}
            nodeColor={(n) => CORES_PODER[n.data?.tipo] || CORES_PODER.outro}
          />
        )}
        <AjusteAutomatico />
      </ReactFlow>
    </div>
  );
}