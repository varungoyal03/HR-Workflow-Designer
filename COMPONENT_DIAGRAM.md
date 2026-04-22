# Component Structure Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                 │
│                         (Root Component)                             │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       WorkflowCanvas.tsx                             │
│                    (Main Container Component)                        │
│                                                                       │
│  State: nodes, edges, selectedNode, showSimulation                  │
│  Hooks: useWorkflowState, useState, useCallback                     │
│                                                                       │
├────────────────┬─────────────────────┬──────────────────────────────┤
│                │                     │                              │
│                ▼                     ▼                              ▼
│  ┌─────────────────────┐  ┌──────────────────┐    ┌─────────────────────┐
│  │  NodeSidebar.tsx    │  │  ReactFlow       │    │ NodeEditPanel.tsx   │
│  │  ─────────────────  │  │  ──────────      │    │ ──────────────────  │
│  │  - Node palette     │  │  - Canvas        │    │ - Edit forms        │
│  │  - Drag source      │  │  - Controls      │    │ - Validation        │
│  │  - Click to add     │  │  - MiniMap       │    │ - Delete action     │
│  │                     │  │  - Background    │    │                     │
│  │  Props:             │  │                  │    │ Props:              │
│  │  - onAddNode        │  │  Props:          │    │ - node              │
│  │                     │  │  - nodes         │    │ - onUpdate          │
│  │  Renders:           │  │  - edges         │    │ - onClose           │
│  │  - 5 node type      │  │  - onConnect     │    │ - onDelete          │
│  │    buttons          │  │  - nodeTypes     │    │                     │
│  │                     │  │                  │    │ Renders:            │
│  └─────────────────────┘  │  Custom Nodes:   │    │ - StartNodeForm     │
│                           │  ▼               │    │ - TaskNodeForm      │
│                           │  CustomNode.tsx  │    │ - ApprovalNodeForm  │
│                           │  ───────────────  │    │ - AutomatedNodeForm │
│                           │  - Node UI       │    │ - EndNodeForm       │
│                           │  - Icon display  │    │                     │
│                           │  - Details       │    │ Uses:               │
│                           │  - Handles       │    │ - useAutomations    │
│                           │                  │    │                     │
│                           │  Props:          │    └─────────────────────┘
│                           │  - data          │
│                           │  - selected      │
│                           │                  │
│                           └──────────────────┘
│
│                                ▼
│                   ┌──────────────────────────┐
│                   │  SimulationPanel.tsx     │
│                   │  ────────────────────     │
│                   │  - Run simulation        │
│                   │  - Display results       │
│                   │  - Step visualization    │
│                   │  - Error reporting       │
│                   │                          │
│                   │  Props:                  │
│                   │  - nodes                 │
│                   │  - edges                 │
│                   │  - onClose               │
│                   │                          │
│                   │  Uses:                   │
│                   │  - workflowApi           │
│                   │  - validateWorkflow      │
│                   │                          │
│                   └──────────────────────────┘
└─────────────────────────────────────────────────────────────────────┘


Data Flow:
━━━━━━━━━

┌─────────────┐       ┌──────────────────┐       ┌──────────────┐
│ User Action │  ───▶ │ WorkflowCanvas   │  ───▶ │ State Update │
└─────────────┘       │ (event handler)  │       └──────────────┘
                      └──────────────────┘              │
                              │                         │
                              ▼                         ▼
                      ┌──────────────────┐       ┌──────────────┐
                      │ useWorkflowState │  ◀──  │ React Flow   │
                      │ (custom hook)    │       │ Re-renders   │
                      └──────────────────┘       └──────────────┘


Hook Dependencies:
━━━━━━━━━━━━━━━━━

┌─────────────────────────┐
│  useWorkflowState       │
│  ───────────────────     │
│                         │
│  State:                 │
│  - nodes: Node[]        │
│  - edges: Edge[]        │
│  - selectedNode         │
│                         │
│  Actions:               │
│  - addNode()            │
│  - updateNodeData()     │
│  - deleteNode()         │
│  - deleteEdge()         │
│  - addEdge()            │
│  - clearWorkflow()      │
│                         │
└─────────────────────────┘

┌─────────────────────────┐
│  useAutomations         │
│  ───────────────         │
│                         │
│  State:                 │
│  - automations: []      │
│  - loading: boolean     │
│  - error: string        │
│                         │
│  Actions:               │
│  - reload()             │
│                         │
│  API Call:              │
│  - workflowApi          │
│    .getAutomations()    │
│                         │
└─────────────────────────┘


API Layer:
━━━━━━━━━━

┌──────────────────────────────────────┐
│  workflowApi.ts                      │
│  ─────────────────                    │
│                                      │
│  Functions:                          │
│  ┌────────────────────────────────┐ │
│  │ getAutomations()               │ │
│  │ → Returns: AutomationAction[]  │ │
│  │ → Mock: 8 predefined actions   │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ simulateWorkflow(request)      │ │
│  │ → Validates workflow           │ │
│  │ → Executes BFS traversal       │ │
│  │ → Returns: SimulationResult    │ │
│  └────────────────────────────────┘ │
│                                      │
│  Dependencies:                       │
│  - mockData.ts (8 actions)          │
│  - Delay simulation (300-800ms)     │
│                                      │
└──────────────────────────────────────┘


Validation Flow:
━━━━━━━━━━━━━━━━

┌───────────────┐
│ validateWorkflow()
│ ────────────────
│
│ Checks:
│ 1. Start node exists (exactly one)
│ 2. End node exists (at least one)
│ 3. No disconnected nodes
│ 4. No circular dependencies (DFS)
│ 5. Node-specific validation
│
│ Returns:
│ {
│   isValid: boolean,
│   errors: ValidationError[]
│ }
│
└───────────────┘
        │
        ▼
┌───────────────────────────┐
│ Visual Indicators:        │
│ - Error badge (top-right) │
│ - Warning badge           │
│ - Tooltip messages        │
│ - Node border colors      │
└───────────────────────────┘


Simulation Flow:
━━━━━━━━━━━━━━━━

User clicks "Run Simulation"
        │
        ▼
┌─────────────────────┐
│ 1. Validate         │
│    - Check errors   │
│    - Abort if fails │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ 2. API Call         │
│    - Send workflow  │
│    - Get result     │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ 3. Display Results  │
│    - Status badge   │
│    - Step timeline  │
│    - Errors list    │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ 4. Animate Steps    │
│    - Fade in        │
│    - Status icons   │
│    - Details        │
└─────────────────────┘


TypeScript Type System:
━━━━━━━━━━━━━━━━━━━━━━

WorkflowNodeData (Discriminated Union)
│
├── StartNodeData
│   ├── type: 'start'
│   ├── title: string
│   └── metadata?: Record<string, string>
│
├── TaskNodeData
│   ├── type: 'task'
│   ├── title: string
│   ├── description?: string
│   ├── assignee?: string
│   ├── dueDate?: string
│   └── customFields?: Record<string, string>
│
├── ApprovalNodeData
│   ├── type: 'approval'
│   ├── title: string
│   ├── approverRole: string
│   └── autoApproveThreshold?: number
│
├── AutomatedNodeData
│   ├── type: 'automated'
│   ├── title: string
│   ├── actionId?: string
│   ├── actionLabel?: string
│   └── parameters?: Record<string, string>
│
└── EndNodeData
    ├── type: 'end'
    ├── endMessage: string
    └── summaryFlag?: boolean


File Dependencies:
━━━━━━━━━━━━━━━━━

WorkflowCanvas.tsx
│
├── Imports:
│   ├── @xyflow/react (ReactFlow, Background, Controls, etc.)
│   ├── CustomNode (./nodes/CustomNode)
│   ├── NodeSidebar (./sidebar/NodeSidebar)
│   ├── NodeEditPanel (./panels/NodeEditPanel)
│   ├── SimulationPanel (./panels/SimulationPanel)
│   ├── useWorkflowState (../../hooks/useWorkflowState)
│   └── validateWorkflow (../../utils/workflowValidation)
│
└── Exports:
    └── WorkflowCanvas (default)

CustomNode.tsx
│
├── Imports:
│   ├── @xyflow/react (Handle, Position, memo)
│   ├── lucide-react (icons)
│   └── workflow.types (WorkflowNodeData)
│
└── Exports:
    └── CustomNode (memo-wrapped, default)

NodeEditPanel.tsx
│
├── Imports:
│   ├── workflow.types (all node data types)
│   ├── useAutomations (../../hooks/useAutomations)
│   └── lucide-react (icons)
│
└── Exports:
    └── NodeEditPanel (default)
    
And more...
```
