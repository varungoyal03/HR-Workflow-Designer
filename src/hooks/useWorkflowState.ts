import { useState, useCallback, useEffect, useRef } from 'react';
import type { Node, Edge, Connection } from '@xyflow/react';
import type { WorkflowNode, WorkflowNodeData, NodeType } from '../types/workflow.types';

let nodeIdCounter = 1;

interface HistoryState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

const MAX_HISTORY_SIZE = 50;

export function useWorkflowState() {
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: [], edges: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  // Save to history whenever nodes or edges change (except during undo/redo)
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    // Only save if there's an actual change
    const currentState = history[historyIndex];
    if (
      JSON.stringify(currentState.nodes) === JSON.stringify(nodes) &&
      JSON.stringify(currentState.edges) === JSON.stringify(edges)
    ) {
      return;
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    
    // Limit history size
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [nodes, edges, history, historyIndex]);

  const addNode = useCallback((type: NodeType, position?: { x: number; y: number }) => {
    const id = `node-${nodeIdCounter++}`;
    const nodePosition = position || { x: 250, y: 250 };

    const newNode: WorkflowNode = {
      id,
      type: 'custom',
      position: nodePosition,
      data: createDefaultNodeData(type)
    };

    setNodes(nds => [...nds, newNode]);
    return newNode;
  }, []);

  const updateNodeData = useCallback((nodeId: string, newData: Partial<WorkflowNodeData>) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } as WorkflowNodeData }
          : node
      )
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId));
  }, []);

  const addEdge = useCallback((connection: Connection) => {
    const edge: Edge = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      type: 'smoothstep',
      animated: true
    };
    setEdges(eds => [...eds, edge]);
  }, []);

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setHistory([{ nodes: [], edges: [] }]);
    setHistoryIndex(0);
  }, []);

  const saveToHistory = useCallback(() => {
    // Manual save - force a new history entry
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [nodes, edges, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const prevState = history[historyIndex - 1];
      setNodes([...prevState.nodes]);
      setEdges([...prevState.edges]);
      setHistoryIndex(historyIndex - 1);
      setSelectedNode(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const nextState = history[historyIndex + 1];
      setNodes([...nextState.nodes]);
      setEdges([...nextState.edges]);
      setHistoryIndex(historyIndex + 1);
      setSelectedNode(null);
    }
  }, [history, historyIndex]);

  const importWorkflow = useCallback((data: { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }) => {
    setNodes(data.nodes);
    setEdges(data.edges);
    setSelectedNode(null);
  }, []);

  const addNodeFromTemplate = useCallback((template: WorkflowNode) => {
    const id = `node-${nodeIdCounter++}`;
    const newNode: WorkflowNode = {
      ...template,
      id,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
    };
    setNodes(nds => [...nds, newNode]);
    return newNode;
  }, []);

  const loadWorkflowTemplate = useCallback((templateNodes: Node<WorkflowNodeData>[], templateEdges: Edge[]) => {
    setNodes(templateNodes);
    setEdges(templateEdges);
    setSelectedNode(null);
  }, []);

  return {
    nodes,
    edges,
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    updateNodeData,
    deleteNode,
    deleteEdge,
    addEdge,
    clearWorkflow,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    importWorkflow,
    addNodeFromTemplate,
    loadWorkflowTemplate,
    saveToHistory
  };
}

function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return {
        type: 'start',
        label: 'Start',
        title: 'Workflow Start'
      };
    case 'task':
      return {
        type: 'task',
        label: 'Task',
        title: 'New Task'
      };
    case 'approval':
      return {
        type: 'approval',
        label: 'Approval',
        title: 'New Approval',
        approverRole: 'Manager'
      };
    case 'automated':
      return {
        type: 'automated',
        label: 'Automated Step',
        title: 'New Automation'
      };
    case 'end':
      return {
        type: 'end',
        label: 'End',
        endMessage: 'Workflow Complete'
      };
  }
}
