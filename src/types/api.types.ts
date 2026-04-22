export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description?: string;
}

export interface SimulationStep {
  stepNumber: number;
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
  error?: string;
}

export interface SimulationResult {
  workflowId: string;
  status: 'success' | 'failed' | 'partial';
  steps: SimulationStep[];
  errors: string[];
  executionTime: number;
  summary: string;
  summaryReport?: string;
}

export interface SimulationRequest {
  workflow: {
    nodes: any[];
    edges: any[];
  };
}
