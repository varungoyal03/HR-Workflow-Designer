import type { WorkflowNode } from '../types/workflow.types';
import type { Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: WorkflowNode[];
  edges: Edge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Complete workflow for onboarding new employees',
    icon: '👥',
    nodes: [
      {
        id: 'start-1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'New Employee Onboarding',
          type: 'start',
          title: 'New Employee Onboarding',
        },
      },
      {
        id: 'task-1',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'Create Employee Profile',
          type: 'task',
          title: 'Create Employee Profile',
          assignee: 'HR Team',
          description: 'Set up employee account and profile in HRIS',
          dueDate: '',
        },
      },
      {
        id: 'task-2',
        type: 'custom',
        position: { x: 250, y: 350 },
        data: {
          label: 'Background Check',
          type: 'task',
          title: 'Background Check',
          assignee: 'Security Team',
          description: 'Conduct background verification',
          dueDate: '',
        },
      },
      {
        id: 'approval-1',
        type: 'custom',
        position: { x: 250, y: 500 },
        data: {
          label: 'Manager Approval',
          type: 'approval',
          title: 'Manager Approval',
          approverRole: 'Department Manager',
        },
      },
      {
        id: 'automated-1',
        type: 'custom',
        position: { x: 250, y: 650 },
        data: {
          label: 'Send Welcome Email',
          type: 'automated',
          title: 'Send Welcome Email',
          actionId: 'email-service',
          actionLabel: 'Email Service',
          parameters: { template: 'welcome', sendToEmployee: 'true' },
        },
      },
      {
        id: 'task-3',
        type: 'custom',
        position: { x: 250, y: 800 },
        data: {
          label: 'Setup Workstation',
          type: 'task',
          title: 'Setup Workstation',
          assignee: 'IT Team',
          description: 'Prepare laptop, accounts, and access badges',
          dueDate: '',
        },
      },
      {
        id: 'automated-2',
        type: 'custom',
        position: { x: 250, y: 950 },
        data: {
          label: 'Create Onboarding Tasks',
          type: 'automated',
          title: 'Create Onboarding Tasks',
          actionId: 'jira',
          actionLabel: 'JIRA',
          parameters: { project: 'ONBOARDING', assignee: 'new_employee' },
        },
      },
      {
        id: 'end-1',
        type: 'custom',
        position: { x: 250, y: 1100 },
        data: {
          label: 'Onboarding Complete',
          type: 'end',
          endMessage: 'Employee successfully onboarded',
        },
      },
    ],
    edges: [
      { id: 'e-start-task1', source: 'start-1', target: 'task-1', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
      { id: 'e-task1-task2', source: 'task-1', target: 'task-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
      { id: 'e-task2-approval1', source: 'task-2', target: 'approval-1', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
      { id: 'e-approval1-auto1', source: 'approval-1', target: 'automated-1', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 } },
      { id: 'e-auto1-task3', source: 'automated-1', target: 'task-3', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
      { id: 'e-task3-auto2', source: 'task-3', target: 'automated-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
      { id: 'e-auto2-end', source: 'automated-2', target: 'end-1', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    ],
  },
  {
    id: 'expense-approval',
    name: 'Expense Approval',
    description: 'Complete workflow for employee expense reimbursement',
    icon: '💰',
    nodes: [
      {
        id: 'start-2',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Expense Request Submitted',
          type: 'start',
          title: 'Expense Request Submitted',
        },
      },
      {
        id: 'task-4',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'Review Receipts',
          type: 'task',
          title: 'Review Receipts',
          assignee: 'Finance Team',
          description: 'Verify expense receipts and amounts',
          dueDate: '',
        },
      },
      {
        id: 'approval-2',
        type: 'custom',
        position: { x: 250, y: 350 },
        data: {
          label: 'Manager Approval',
          type: 'approval',
          title: 'Manager Approval',
          approverRole: 'Direct Manager',
        },
      },
      {
        id: 'approval-3',
        type: 'custom',
        position: { x: 250, y: 500 },
        data: {
          label: 'Finance Head Approval',
          type: 'approval',
          title: 'Finance Head Approval',
          approverRole: 'Finance Director',
        },
      },
      {
        id: 'automated-3',
        type: 'custom',
        position: { x: 250, y: 650 },
        data: {
          label: 'Process Payment',
          type: 'automated',
          title: 'Process Payment',
          actionId: 'accounting-system',
          actionLabel: 'Accounting System',
          parameters: { method: 'direct_deposit', notify: 'true' },
        },
      },
      {
        id: 'automated-4',
        type: 'custom',
        position: { x: 250, y: 800 },
        data: {
          label: 'Send Confirmation',
          type: 'automated',
          title: 'Send Confirmation',
          actionId: 'email-service',
          actionLabel: 'Email Service',
          parameters: { template: 'payment_confirmation' },
        },
      },
      {
        id: 'end-2',
        type: 'custom',
        position: { x: 250, y: 950 },
        data: {
          label: 'Expense Processed',
          type: 'end',
          endMessage: 'Expense approved and paid',
        },
      },
    ],
    edges: [
      { id: 'e2-start-task', source: 'start-2', target: 'task-4', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
      { id: 'e2-task-approval1', source: 'task-4', target: 'approval-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
      { id: 'e2-approval1-approval2', source: 'approval-2', target: 'approval-3', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 } },
      { id: 'e2-approval2-auto1', source: 'approval-3', target: 'automated-3', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 } },
      { id: 'e2-auto1-auto2', source: 'automated-3', target: 'automated-4', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
      { id: 'e2-auto2-end', source: 'automated-4', target: 'end-2', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    ],
  },
  {
    id: 'leave-request',
    name: 'Leave Request',
    description: 'Workflow for requesting and approving employee time off',
    icon: '🏖️',
    nodes: [
      {
        id: 'start-3',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Leave Request Submitted',
          type: 'start',
          title: 'Leave Request Submitted',
        },
      },
      {
        id: 'task-5',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'Check Leave Balance',
          type: 'task',
          title: 'Check Leave Balance',
          assignee: 'HR System',
          description: 'Verify employee has sufficient leave balance',
          dueDate: '',
        },
      },
      {
        id: 'approval-4',
        type: 'custom',
        position: { x: 250, y: 350 },
        data: {
          label: 'Manager Approval',
          type: 'approval',
          title: 'Manager Approval',
          approverRole: 'Direct Manager',
        },
      },
      {
        id: 'automated-5',
        type: 'custom',
        position: { x: 250, y: 500 },
        data: {
          label: 'Update Calendar',
          type: 'automated',
          title: 'Update Calendar',
          actionId: 'google-calendar',
          actionLabel: 'Google Calendar',
          parameters: { calendar: 'team_calendar', all_day: 'true' },
        },
      },
      {
        id: 'automated-6',
        type: 'custom',
        position: { x: 250, y: 650 },
        data: {
          label: 'Notify Team',
          type: 'automated',
          title: 'Notify Team',
          actionId: 'slack',
          actionLabel: 'Slack',
          parameters: { channel: 'team-announcements' },
        },
      },
      {
        id: 'end-3',
        type: 'custom',
        position: { x: 250, y: 800 },
        data: {
          label: 'Leave Approved',
          type: 'end',
          endMessage: 'Leave request processed successfully',
        },
      },
    ],
    edges: [
      { id: 'e3-start-task', source: 'start-3', target: 'task-5', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
      { id: 'e3-task-approval', source: 'task-5', target: 'approval-4', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
      { id: 'e3-approval-auto1', source: 'approval-4', target: 'automated-5', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 } },
      { id: 'e3-auto1-auto2', source: 'automated-5', target: 'automated-6', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
      { id: 'e3-auto2-end', source: 'automated-6', target: 'end-3', type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    ],
  },
];
