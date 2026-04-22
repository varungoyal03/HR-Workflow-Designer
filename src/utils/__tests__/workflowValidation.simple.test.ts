import { describe, it, expect } from 'vitest';
import { validateWorkflow } from '../../utils/workflowValidation';
import type { WorkflowNode, WorkflowEdge } from '../../types/workflow.types';

describe('workflowValidation - Simple Tests', () => {
  it('should return valid for empty workflow', () => {
    const result = validateWorkflow([], []);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require exactly one start node', () => {
    const nodes: WorkflowNode[] = [
      {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { type: 'task', label: 'Task 1', title: 'Task', description: '', dueDate: '' }
      }
    ];
    const result = validateWorkflow(nodes, []);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.message.includes('Start node'))).toBe(true);
  });

  it('should detect multiple start nodes', () => {
    const nodes: WorkflowNode[] = [
      {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { type: 'start', label: 'Start 1', title: 'Start 1' }
      },
      {
        id: '2',
        type: 'custom',
        position: { x: 100, y: 0 },
        data: { type: 'start', label: 'Start 2', title: 'Start 2' }
      }
    ];
    const result = validateWorkflow(nodes, []);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.message.includes('only have one Start node'))).toBe(true);
  });

  it('should warn about missing end node', () => {
    const nodes: WorkflowNode[] = [
      {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { type: 'start', label: 'Start', title: 'Start' }
      }
    ];
    const result = validateWorkflow(nodes, []);
    
    expect(result.errors.some(e => e.message.includes('End node') && e.severity === 'warning')).toBe(true);
  });

  it('should detect disconnected nodes', () => {
    const nodes: WorkflowNode[] = [
      {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { type: 'start', label: 'Start', title: 'Start' }
      },
      {
        id: '2',
        type: 'custom',
        position: { x: 100, y: 0 },
        data: { type: 'task', label: 'Disconnected Task', title: 'Task', description: '', dueDate: '' }
      },
      {
        id: '3',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: { type: 'end', label: 'End', endMessage: '' }
      }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' }
    ];
    
    const result = validateWorkflow(nodes, edges);
    expect(result.errors.some(e => e.message.includes('not connected') && e.nodeId === '2')).toBe(true);
  });

  it('should detect cycles in workflow', () => {
    const nodes: WorkflowNode[] = [
      {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { type: 'start', label: 'Start', title: 'Start' }
      },
      {
        id: '2',
        type: 'custom',
        position: { x: 100, y: 0 },
        data: { type: 'task', label: 'Task 1', title: 'Task', description: '', dueDate: '' }
      },
      {
        id: '3',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: { type: 'task', label: 'Task 2', title: 'Task', description: '', dueDate: '' }
      }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
      { id: 'e3-2', source: '3', target: '2', type: 'smoothstep' } // Creates cycle
    ];
    
    const result = validateWorkflow(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.message.includes('circular dependencies'))).toBe(true);
  });
});
