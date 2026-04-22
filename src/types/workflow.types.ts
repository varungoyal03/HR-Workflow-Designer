import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  title: string;
  actionId?: string;
  actionLabel?: string;
  parameters?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag?: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: ValidationError[];
}
