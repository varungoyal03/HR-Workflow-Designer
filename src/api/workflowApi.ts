import type { AutomationAction, SimulationRequest, SimulationResult, SimulationStep } from '../types/api.types';
import { mockAutomations } from './mockData';
import type { WorkflowNode, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../types/workflow.types';
import type { Edge } from '@xyflow/react';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowApi = {
  /**
   * Get all available automation actions
   */
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(300);
    return mockAutomations;
  },

  /**
   * Simulate workflow execution
   */
  simulateWorkflow: async (request: SimulationRequest): Promise<SimulationResult> => {
    await delay(800);
    
    const { nodes, edges } = request.workflow;
    const steps: SimulationStep[] = [];
    const errors: string[] = [];
    const startTime = Date.now();

    // Find start node
    const startNode = nodes.find((n: WorkflowNode) => n.data.type === 'start');
    
    if (!startNode) {
      errors.push('No start node found in workflow');
      return {
        workflowId: 'sim-' + Date.now(),
        status: 'failed',
        steps: [],
        errors,
        executionTime: Date.now() - startTime,
        summary: 'Workflow validation failed: No start node found'
      };
    }

    // Build execution path using BFS
    const visited = new Set<string>();
    const queue: string[] = [startNode.id];
    let stepNumber = 1;

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      
      if (visited.has(currentNodeId)) {
        continue;
      }
      
      visited.add(currentNodeId);
      const currentNode = nodes.find((n: WorkflowNode) => n.id === currentNodeId);
      
      if (!currentNode) continue;

      const step: SimulationStep = {
        stepNumber: stepNumber++,
        nodeId: currentNode.id,
        nodeType: currentNode.data.type,
        nodeTitle: currentNode.data.label || currentNode.data.title || 'Untitled',
        status: 'completed',
        timestamp: new Date(Date.now() + stepNumber * 1000).toISOString(),
        details: generateStepDetails(currentNode)
      };

      // Simulate potential failures
      if (currentNode.data.type === 'approval' && Math.random() < 0.1) {
        step.status = 'failed';
        step.error = 'Approval timeout - no response from approver';
        errors.push(`Step ${stepNumber}: ${step.error}`);
      }

      steps.push(step);

      // Find next nodes
      const outgoingEdges = edges.filter((e: Edge) => e.source === currentNodeId);
      outgoingEdges.forEach((edge: Edge) => {
        if (!visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }

    const executionTime = Date.now() - startTime;
    const hasErrors = errors.length > 0;

    // Check if end node has summary flag enabled
    const endNode = nodes.find((n: WorkflowNode) => n.data.type === 'end');
    const shouldGenerateSummary = endNode && (endNode.data as EndNodeData).summaryFlag;

    return {
      workflowId: 'sim-' + Date.now(),
      status: hasErrors ? 'partial' : 'success',
      steps,
      errors,
      executionTime,
      summary: hasErrors 
        ? `Workflow completed with ${errors.length} error(s)` 
        : `Workflow executed successfully with ${steps.length} steps`,
      summaryReport: shouldGenerateSummary ? generateSummaryReport(nodes, steps, executionTime) : undefined
    };
  }
};

function generateStepDetails(node: WorkflowNode): string {
  const data = node.data;
  
  switch (data.type) {
    case 'start':
      return `Workflow initiated: ${data.title}`;
    case 'task':
      return `Task assigned to ${(data as TaskNodeData).assignee || 'unassigned'}`;
    case 'approval':
      return `Approval requested from ${(data as ApprovalNodeData).approverRole}`;
    case 'automated':
      return `Automation executed: ${(data as AutomatedNodeData).actionLabel || 'Unknown action'}`;
    case 'end':
      return `Workflow completed: ${(data as EndNodeData).endMessage}`;
    default:
      return 'Step executed';
  }
}

function generateSummaryReport(nodes: WorkflowNode[], steps: SimulationStep[], executionTime: number): string {
  const taskNodes = nodes.filter(n => n.data.type === 'task');
  const approvalNodes = nodes.filter(n => n.data.type === 'approval');
  const automatedNodes = nodes.filter(n => n.data.type === 'automated');
  
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const failedSteps = steps.filter(s => s.status === 'failed').length;
  
  let report = '📊 WORKFLOW EXECUTION SUMMARY REPORT\n\n';
  report += '═'.repeat(50) + '\n\n';
  
  report += '📈 EXECUTION OVERVIEW\n';
  report += `   Total Steps: ${steps.length}\n`;
  report += `   ✓ Completed: ${completedSteps}\n`;
  report += `   ✗ Failed: ${failedSteps}\n`;
  report += `   ⏱ Execution Time: ${executionTime}ms\n\n`;
  
  report += '📋 WORKFLOW COMPOSITION\n';
  report += `   Tasks: ${taskNodes.length}\n`;
  report += `   Approvals: ${approvalNodes.length}\n`;
  report += `   Automations: ${automatedNodes.length}\n\n`;
  
  if (taskNodes.length > 0) {
    report += '👥 TASK ASSIGNMENTS\n';
    taskNodes.forEach((node, index) => {
      const taskData = node.data as TaskNodeData;
      report += `   ${index + 1}. ${taskData.title}\n`;
      report += `      Assignee: ${taskData.assignee || 'Unassigned'}\n`;
      if (taskData.dueDate) {
        report += `      Due Date: ${taskData.dueDate}\n`;
      }
    });
    report += '\n';
  }
  
  if (approvalNodes.length > 0) {
    report += '✅ APPROVAL CHECKPOINTS\n';
    approvalNodes.forEach((node, index) => {
      const approvalData = node.data as ApprovalNodeData;
      report += `   ${index + 1}. ${approvalData.title}\n`;
      report += `      Approver: ${approvalData.approverRole}\n`;
      if (approvalData.autoApproveThreshold && approvalData.autoApproveThreshold > 0) {
        report += `      Auto-approve threshold: ≤${approvalData.autoApproveThreshold}\n`;
      }
    });
    report += '\n';
  }
  
  if (automatedNodes.length > 0) {
    report += '⚡ AUTOMATED ACTIONS\n';
    automatedNodes.forEach((node, index) => {
      const autoData = node.data as AutomatedNodeData;
      report += `   ${index + 1}. ${autoData.title}\n`;
      report += `      Action: ${autoData.actionLabel || 'Not configured'}\n`;
    });
    report += '\n';
  }
  
  report += '═'.repeat(50) + '\n';
  report += 'Report generated: ' + new Date().toLocaleString() + '\n';
  
  return report;
}
