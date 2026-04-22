import type { WorkflowNode } from '../types/workflow.types';

export const nodeTemplates: WorkflowNode[] = [
  {
    id: 'template-employee-onboarding-start',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'start',
      label: 'Employee Onboarding',
      title: 'New Employee Onboarding',
      metadata: {
        department: 'HR',
        priority: 'High'
      }
    }
  },
  {
    id: 'template-background-check',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'task',
      label: 'Background Check',
      title: 'Complete Background Check',
      description: 'Verify candidate employment history and credentials',
      assignee: 'HR Coordinator',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  {
    id: 'template-manager-approval',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'approval',
      label: 'Manager Approval',
      title: 'Direct Manager Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 0
    }
  },
  {
    id: 'template-send-offer-letter',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'automated',
      label: 'Send Offer Letter',
      title: 'Send Offer Letter Email',
      actionId: 'email-send',
      actionLabel: 'Send Email',
      parameters: {
        template: 'offer_letter',
        recipient: '{{candidate_email}}'
      }
    }
  },
  {
    id: 'template-expense-approval',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'approval',
      label: 'Expense Approval',
      title: 'Expense Report Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 500
    }
  },
  {
    id: 'template-create-jira-ticket',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'automated',
      label: 'Create JIRA Ticket',
      title: 'Create IT Setup Ticket',
      actionId: 'jira-create',
      actionLabel: 'Create JIRA Ticket',
      parameters: {
        project: 'IT',
        type: 'Task',
        priority: 'High'
      }
    }
  },
  {
    id: 'template-workflow-complete',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      type: 'end',
      label: 'Workflow Complete',
      endMessage: 'Process Completed Successfully',
      summaryFlag: true
    }
  }
];
