import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
  type Connection,
  type NodeTypes,
  type ReactFlowInstance,
  ConnectionLineType,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "../nodes/CustomNode";
import NodeSidebar from "../sidebar/NodeSidebar";
import NodeEditPanel from "../panels/NodeEditPanel";
import SimulationPanel from "../panels/SimulationPanel";
import ExportModal from "../modals/ExportModal";
import type { NodeType, WorkflowNode } from "../../types/workflow.types";
import { useWorkflowState } from "../../hooks/useWorkflowState";
import { validateWorkflow } from "../../utils/workflowValidation";
import {
  FileJson,
  AlertTriangle,
  Play,
  Trash2,
  Upload,
  Undo2,
  Redo2,
  LayoutGrid,
} from "lucide-react";
import { workflowTemplates } from "../../data/workflowTemplates";
import { nodeTemplates } from "../../data/nodeTemplates";
import "./WorkflowCanvas.css";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const getNodeColor = (type: string) => {
  switch (type) {
    case "start":
      return "#10b981";
    case "task":
      return "#3b82f6";
    case "approval":
      return "#f59e0b";
    case "automated":
      return "#8b5cf6";
    case "end":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    nodes,
    edges,
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    updateNodeData,
    deleteNode,
    clearWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
    importWorkflow,
    saveToHistory,
    addNodeFromTemplate,
    loadWorkflowTemplate,
  } = useWorkflowState();

  const onConnect = useCallback(
    (connection: Connection) => {
      // Get the source node to determine the color
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const nodeColor = sourceNode?.data?.type
        ? getNodeColor(sourceNode.data.type)
        : "#3b82f6";

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            style: { stroke: nodeColor, strokeWidth: 3 },
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

  const onNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node as WorkflowNode);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const position = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      };
      addNode(type, position);
    },
    [addNode]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Handle different drop types
      if (type === "template") {
        const templateId = event.dataTransfer.getData("templateId");
        const template = nodeTemplates.find((t) => t.id === templateId);
        if (template) {
          const nodeWithPosition = { ...template, position };
          addNodeFromTemplate(nodeWithPosition);
        }
      } else if (type === "workflow") {
        const workflowId = event.dataTransfer.getData("workflowId");
        const workflow = workflowTemplates.find((w) => w.id === workflowId);
        if (workflow) {
          loadWorkflowTemplate(workflow.nodes, workflow.edges);
          setTimeout(() => {
            reactFlowInstance?.fitView({ padding: 0.2, duration: 400 });
          }, 50);
        }
      } else {
        // Handle basic node types
        addNode(type as NodeType, position);
      }
    },
    [reactFlowInstance, addNode, addNodeFromTemplate, loadWorkflowTemplate]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleExport = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleExportConfirm = useCallback((filename: string) => {
    const workflow = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", filename);
    linkElement.click();
    
    setShowExportModal(false);
  }, [nodes, edges]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          
          // Security: Limit file size to 5MB
          if (result.length > 5 * 1024 * 1024) {
            alert("File too large. Maximum size is 5MB.");
            return;
          }
          
          const data = JSON.parse(result);
          
          // Security: Validate expected structure
          if (!data || typeof data !== 'object') {
            alert("Invalid workflow file format");
            return;
          }
          
          if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
            alert("Invalid workflow file format: missing nodes or edges");
            return;
          }
          
          // Security: Validate node count (prevent DoS)
          if (data.nodes.length > 1000 || data.edges.length > 2000) {
            alert("Workflow too large. Maximum 1000 nodes and 2000 edges.");
            return;
          }
          
          importWorkflow({ nodes: data.nodes, edges: data.edges });
        } catch {
          alert("Failed to import workflow: Invalid JSON format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importWorkflow]);

  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) return;

    const positioned = new Set<string>();
    const levelMap = new Map<string, number>();

    // Find start node(s)
    const sourceNodes = nodes.filter(
      (n) => !edges.some((e) => e.target === n.id)
    );

    if (sourceNodes.length === 0) return;

    const startX = 500;
    const startY = 80;
    const verticalSpacing = 180;
    const horizontalSpacing = 400;

    // Build adjacency list for graph traversal
    const adjacency = new Map<string, string[]>();
    edges.forEach((edge) => {
      if (!adjacency.has(edge.source)) {
        adjacency.set(edge.source, []);
      }
      adjacency.get(edge.source)!.push(edge.target);
    });

    // BFS to assign levels
    const queue: { id: string; level: number }[] = sourceNodes.map((n) => ({
      id: n.id,
      level: 0,
    }));

    sourceNodes.forEach((n) => {
      positioned.add(n.id);
      levelMap.set(n.id, 0);
    });

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      const children = adjacency.get(id) || [];

      children.forEach((childId) => {
        if (!positioned.has(childId)) {
          positioned.add(childId);
          levelMap.set(childId, level + 1);
          queue.push({ id: childId, level: level + 1 });
        } else {
          // Update level if this path is longer
          const currentLevel = levelMap.get(childId) || 0;
          if (level + 1 > currentLevel) {
            levelMap.set(childId, level + 1);
          }
        }
      });
    }

    // Group nodes by level
    const levelGroups = new Map<number, string[]>();
    nodes.forEach((node) => {
      const level = levelMap.get(node.id) ?? 0;
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(node.id);
    });

    // Create new nodes array with updated positions
    const layoutNodes = nodes.map((node) => {
      const level = levelMap.get(node.id) ?? 0;
      const nodesInLevel = levelGroups.get(level) || [];
      const nodeCount = nodesInLevel.length;
      const indexInLevel = nodesInLevel.indexOf(node.id);

      let x: number;
      const y = startY + level * verticalSpacing;

      if (nodeCount === 1) {
        x = startX;
      } else {
        const totalWidth = (nodeCount - 1) * horizontalSpacing;
        const levelStartX = startX - totalWidth / 2;
        x = levelStartX + indexInLevel * horizontalSpacing;
      }

      return {
        ...node,
        position: { x, y },
      };
    });

    // Animate with requestAnimationFrame for smooth edge transitions
    const startTime = performance.now();
    const duration = 600;
    const startPositions = new Map(nodes.map(n => [n.id, { ...n.position }]));
    const endPositions = new Map(layoutNodes.map(n => [n.id, { ...n.position }]));
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic bezier easing (0.4, 0, 0.2, 1)
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const animatedNodes = nodes.map(node => {
        const start = startPositions.get(node.id);
        const end = endPositions.get(node.id);
        if (!start || !end) return node;
        
        return {
          ...node,
          position: {
            x: start.x + (end.x - start.x) * easeProgress,
            y: start.y + (end.y - start.y) * easeProgress,
          },
        };
      });
      
      setNodes(animatedNodes);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setNodes(layoutNodes);
        saveToHistory();
      }
    };
    
    requestAnimationFrame(animate);
    
    // Center the view on the workflow
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2, duration: 400 });
    }, 50);
  }, [nodes, edges, setNodes, saveToHistory, reactFlowInstance]);

  const handleLoadWorkflow = useCallback(
    (templateId: string) => {
      const template = workflowTemplates.find((t) => t.id === templateId);
      if (template) {
        loadWorkflowTemplate(template.nodes, template.edges);
      }
    },
    [loadWorkflowTemplate]
  );

  const validation = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);
  const errorCount = validation.errors.filter(
    (e) => e.severity === "error"
  ).length;
  const warningCount = validation.errors.filter(
    (e) => e.severity === "warning"
  ).length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        undo();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "y" || (event.key === "z" && event.shiftKey))
      ) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [undo, redo]);

  return (
    <div className="workflow-designer">
      <NodeSidebar
        onAddNode={handleAddNode}
        onAddTemplate={addNodeFromTemplate}
        onLoadWorkflow={handleLoadWorkflow}
      />

      <div className="workflow-canvas" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds);
          }}
          onEdgesChange={(changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds) as typeof eds);
          }}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          connectionLineStyle={{
            stroke: "#3b82f6",
            strokeWidth: 3,
            strokeDasharray: "5,5",
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: {
              stroke: "#3b82f6",
              strokeWidth: 3,
            },
          }}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
        >
          <Background />
          <Controls />
          <MiniMap position="bottom-right" pannable zoomable />

          <Panel position="top-left" className="toolbar">
            <button
              onClick={() => setShowSimulation(!showSimulation)}
              className="toolbar-btn primary"
            >
              <Play size={16} />
              Test Workflow
            </button>
            <button onClick={handleImport} className="toolbar-btn">
              <Upload size={16} />
              Import
            </button>
            <button
              onClick={handleExport}
              className="toolbar-btn"
              disabled={nodes.length === 0}
            >
              <FileJson size={16} />
              Export
            </button>
            <button
              onClick={undo}
              className="toolbar-btn"
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              className="toolbar-btn"
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
            <button
              onClick={handleAutoLayout}
              className="toolbar-btn"
              disabled={nodes.length === 0}
              title="Auto Layout"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={clearWorkflow}
              className="toolbar-btn danger"
              disabled={nodes.length === 0}
            >
              <Trash2 size={16} />
              Clear
            </button>
          </Panel>

          {!validation.isValid && (
            <Panel position="top-right" className="validation-panel">
              <div
                className="validation-errors"
                onClick={() => setShowValidationDetails(!showValidationDetails)}
                style={{ cursor: "pointer" }}
              >
                <AlertTriangle size={16} />
                <div>
                  {errorCount > 0 && (
                    <div className="error-badge">
                      {errorCount} Error{errorCount !== 1 ? "s" : ""}
                    </div>
                  )}
                  {warningCount > 0 && (
                    <div className="warning-badge">
                      {warningCount} Warning{warningCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {showValidationDetails && (
                <div className="validation-details">
                  {validation.errors.map((error, index) => (
                    <div
                      key={index}
                      className={`validation-message ${error.severity}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (error.nodeId) {
                          const node = nodes.find((n) => n.id === error.nodeId);
                          if (node) setSelectedNode(node);
                        }
                      }}
                    >
                      <span className="validation-icon">
                        {error.severity === "error" ? "✕" : "⚠"}
                      </span>
                      <span className="validation-text">{error.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
        </ReactFlow>

        {selectedNode && (
          <NodeEditPanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={() => setSelectedNode(null)}
            onDelete={deleteNode}
          />
        )}

        {showSimulation && (
          <SimulationPanel
            nodes={nodes}
            edges={edges}
            onClose={() => setShowSimulation(false)}
          />
        )}

        {showExportModal && (
          <ExportModal
            onConfirm={handleExportConfirm}
            onCancel={() => setShowExportModal(false)}
          />
        )}
      </div>
    </div>
  );
}
