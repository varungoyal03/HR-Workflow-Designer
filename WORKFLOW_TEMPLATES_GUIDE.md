# Workflow Templates Guide

## Overview
The HR Workflow Designer now includes pre-built workflow templates that provide complete, ready-to-use workflows with connected nodes.

## Available Templates

### 1. Employee Onboarding 👥
**Complete workflow for onboarding new employees**
- **Nodes:** 8 (Start → 5 Tasks/Approvals/Automations → End)
- **Connections:** 7 edges
- **Flow:**
  1. New Employee Onboarding (Start)
  2. Create Employee Profile (Task - HR Team)
  3. Background Check (Task - Security Team)
  4. Manager Approval (Approval - Department Manager)
  5. Send Welcome Email (Automated - Email Service)
  6. Setup Workstation (Task - IT Team)
  7. Create Onboarding Tasks (Automated - JIRA)
  8. Onboarding Complete (End)

### 2. Expense Approval 💰
**Complete workflow for employee expense reimbursement**
- **Nodes:** 7 (Start → 4 Approvals/Tasks/Automations → End)
- **Connections:** 6 edges
- **Flow:**
  1. Expense Request Submitted (Start)
  2. Review Receipts (Task - Finance Team)
  3. Manager Approval (Approval - Direct Manager)
  4. Finance Head Approval (Approval - Finance Director)
  5. Process Payment (Automated - Accounting System)
  6. Send Confirmation (Automated - Email Service)
  7. Expense Processed (End)

### 3. Leave Request 🏖️
**Workflow for requesting and approving employee time off**
- **Nodes:** 6 (Start → 3 Tasks/Approvals/Automations → End)
- **Connections:** 5 edges
- **Flow:**
  1. Leave Request Submitted (Start)
  2. Check Leave Balance (Task - HR System)
  3. Manager Approval (Approval - Direct Manager)
  4. Update Calendar (Automated - Google Calendar)
  5. Notify Team (Automated - Slack)
  6. Leave Approved (End)

## How to Use Templates

### Loading a Workflow Template
1. Click on the **"Workflows"** tab in the left sidebar
2. Browse the available workflow templates (shown with emoji icons)
3. Click on any template to load it onto the canvas
4. The complete workflow with all nodes and connections will be loaded

### Workflow Template Features
- **Pre-configured Nodes:** All nodes come with appropriate titles, descriptions, and assignments
- **Pre-connected Flow:** Edges are already created showing the workflow path
- **Ready to Customize:** Edit any node to match your specific requirements
- **Hierarchical Layout:** Nodes are positioned vertically in logical flow order

### Template Details
Each template card shows:
- **Icon:** Visual identifier (emoji)
- **Name:** Template name
- **Description:** Brief explanation of the workflow purpose
- **Metadata:** Number of nodes and connections

## Customizing Templates

After loading a template:
1. **Edit Nodes:** Click any node to edit its properties in the right panel
2. **Add Nodes:** Add more nodes from the "Basic Nodes" tab
3. **Add Connections:** Connect nodes by dragging from connection handles
4. **Remove Elements:** Select and press Delete to remove nodes or edges
5. **Auto-layout:** Use the Auto-layout button to reorganize nodes
6. **Save:** Export your customized workflow as JSON

## Template vs. Node Templates

### Workflow Templates (This Feature)
- Complete end-to-end workflows with multiple connected nodes
- Found in the **"Workflows"** tab
- Loads entire workflow replacing current canvas
- Green-themed UI elements

### Node Templates
- Individual pre-configured nodes
- Found in the **"Node Templates"** tab
- Adds single nodes to existing workflow
- Purple-themed UI elements

## Technical Details

### File Location
`src/data/workflowTemplates.ts`

### Structure
```typescript
interface WorkflowTemplate {
  id: string;           // Unique identifier
  name: string;         // Display name
  description: string;  // Brief description
  icon: string;         // Emoji icon
  nodes: WorkflowNode[]; // Array of nodes
  edges: Edge[];        // Array of connections
}
```

### Integration
- Workflows are loaded using `loadWorkflowTemplate()` from `useWorkflowState` hook
- Canvas history is reset when loading a template
- All nodes maintain proper TypeScript typing
- Connections use smooth step edges with animation

## UI Improvements

### Toolbar Enhancements
- Reduced button padding for better fit
- Added flex-wrap for responsive layout
- Optimized spacing (8px gaps)
- Smaller font size (12px) for compact appearance
- Max-width constraint to prevent overflow

### Sidebar Organization
- Three tabs: Basic Nodes, Node Templates, Workflows
- Color-coded tabs (blue active state)
- Workflow items have green theme
- Shows node/edge count for each template
