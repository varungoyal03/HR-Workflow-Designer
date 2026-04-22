import type { WorkflowNode, WorkflowEdge, ValidationError, WorkflowValidation } from '../types/workflow.types';

export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowValidation {
  const errors: ValidationError[] = [];

  // Skip validation for empty canvas
  if (nodes.length === 0) {
    return {
      isValid: true,
      errors: []
    };
  }

  // Check for start node
  const startNodes = nodes.filter(n => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      message: 'Workflow must have exactly one Start node',
      severity: 'error'
    });
  } else if (startNodes.length > 1) {
    errors.push({
      message: 'Workflow can only have one Start node',
      severity: 'error'
    });
  }

  // Check for end node
  const endNodes = nodes.filter(n => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push({
      message: 'Workflow should have at least one End node',
      severity: 'warning'
    });
  }

  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  nodes.forEach(node => {
    if (!connectedNodes.has(node.id) && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        message: `Node "${node.data.label || 'Untitled'}" is not connected`,
        severity: 'warning'
      });
    }
  });

  // Check for cycles (simplified detection)
  if (hasCycle(nodes, edges)) {
    errors.push({
      message: 'Workflow contains circular dependencies',
      severity: 'error'
    });
  }

  // Validate node-specific rules
  nodes.forEach(node => {
    const nodeErrors = validateNode(node, edges);
    errors.push(...nodeErrors);
  });

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  };
}

function validateNode(node: WorkflowNode, edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const incomingEdges = edges.filter(e => e.target === node.id);
  const outgoingEdges = edges.filter(e => e.source === node.id);

  switch (node.data.type) {
    case 'start':
      if (incomingEdges.length > 0) {
        errors.push({
          nodeId: node.id,
          message: 'Start node should not have incoming connections',
          severity: 'error'
        });
      }
      if (outgoingEdges.length === 0) {
        errors.push({
          nodeId: node.id,
          message: 'Start node must have at least one outgoing connection',
          severity: 'error'
        });
      }
      break;

    case 'end':
      if (outgoingEdges.length > 0) {
        errors.push({
          nodeId: node.id,
          message: 'End node should not have outgoing connections',
          severity: 'error'
        });
      }
      break;

    case 'task':
      if (!node.data.title || node.data.title.trim() === '') {
        errors.push({
          nodeId: node.id,
          message: 'Task node must have a title',
          severity: 'error'
        });
      }
      break;

    case 'approval':
      if (!node.data.title || node.data.title.trim() === '') {
        errors.push({
          nodeId: node.id,
          message: 'Approval node must have a title',
          severity: 'error'
        });
      }
      break;
  }

  return errors;
}

function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const adjList = new Map<string, string[]>();
  nodes.forEach(node => adjList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjList.set(edge.source, neighbors);
  });

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

export function exportWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): string {
  const workflow = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    nodes,
    edges
  };
  return JSON.stringify(workflow, null, 2);
}

export function importWorkflow(json: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const workflow = JSON.parse(json);
  return {
    nodes: workflow.nodes || [],
    edges: workflow.edges || []
  };
}
