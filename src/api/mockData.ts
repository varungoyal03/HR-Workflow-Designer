import type { AutomationAction } from '../types/api.types';

export const mockAutomations: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
    description: 'Send an email notification to specified recipients'
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
    description: 'Generate a document from a template'
  },
  {
    id: 'create_ticket',
    label: 'Create IT Ticket',
    params: ['category', 'priority', 'description'],
    description: 'Create a support ticket in the IT system'
  },
  {
    id: 'update_hrms',
    label: 'Update HRMS',
    params: ['employeeId', 'field', 'value'],
    description: 'Update employee data in HR Management System'
  },
  {
    id: 'send_slack',
    label: 'Send Slack Notification',
    params: ['channel', 'message'],
    description: 'Post a message to a Slack channel'
  },
  {
    id: 'assign_training',
    label: 'Assign Training Module',
    params: ['employeeId', 'trainingId'],
    description: 'Assign a training module to an employee'
  },
  {
    id: 'provision_access',
    label: 'Provision System Access',
    params: ['system', 'accessLevel', 'employeeId'],
    description: 'Grant access to company systems'
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    params: ['attendees', 'duration', 'subject'],
    description: 'Schedule a calendar meeting'
  }
];
