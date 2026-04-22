import { useState } from "react";
import type { NodeType, WorkflowNode } from "../../types/workflow.types";
import {
  PlayCircle,
  CheckSquare,
  UserCheck,
  Zap,
  StopCircle,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { nodeTemplates } from "../../data/nodeTemplates";
import { workflowTemplates } from "../../data/workflowTemplates";
import "./NodeSidebar.css";

interface NodeSidebarProps {
  onAddNode: (type: NodeType) => void;
  onAddTemplate?: (template: WorkflowNode) => void;
  onLoadWorkflow?: (templateId: string) => void;
}

const nodeColors: Record<string, string> = {
  start: "#10b981",
  task: "#3b82f6",
  approval: "#f59e0b",
  automated: "#8b5cf6",
  end: "#ef4444",
};

const nodeTypes: Array<{
  type: NodeType;
  label: string;
  icon: LucideIcon;
  description: string;
}> = [
  {
    type: "start",
    label: "Start",
    icon: PlayCircle,
    description: "Workflow entry point",
  },
  {
    type: "task",
    label: "Task",
    icon: CheckSquare,
    description: "Human task assignment",
  },
  {
    type: "approval",
    label: "Approval",
    icon: UserCheck,
    description: "Manager/HR approval",
  },
  {
    type: "automated",
    label: "Automation",
    icon: Zap,
    description: "System action",
  },
  {
    type: "end",
    label: "End",
    icon: StopCircle,
    description: "Workflow completion",
  },
];

export default function NodeSidebar({
  onAddNode,
  onAddTemplate,
  onLoadWorkflow,
}: NodeSidebarProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);

  return (
    <div className="node-sidebar">
      <div className="sidebar-header">
        <h3>Workflow Builder</h3>
        <p>Drag nodes or load templates</p>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-btn ${
            !showTemplates && !showWorkflows ? "active" : ""
          }`}
          onClick={() => {
            setShowTemplates(false);
            setShowWorkflows(false);
          }}
        >
          Basic
        </button>
        <button
          className={`tab-btn ${showTemplates ? "active" : ""}`}
          onClick={() => {
            setShowTemplates(true);
            setShowWorkflows(false);
          }}
        >
          <Sparkles size={13} />
          Templates
        </button>
        <button
          className={`tab-btn ${showWorkflows ? "active" : ""}`}
          onClick={() => {
            setShowTemplates(false);
            setShowWorkflows(true);
          }}
        >
          <Workflow size={13} />
          Workflows
        </button>
      </div>

      <div className="node-list">
        {!showTemplates && !showWorkflows ? (
          nodeTypes.map(({ type, label, icon: Icon, description }) => (
            <div
              key={type}
              className="node-item"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow", type);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => onAddNode(type)}
            >
              <div className="node-item-icon">
                <Icon size={20} color={nodeColors[type]} />
              </div>
              <div className="node-item-content">
                <div className="node-item-label">{label}</div>
                <div className="node-item-description">{description}</div>
              </div>
            </div>
          ))
        ) : showTemplates ? (
          nodeTemplates.map((template) => (
            <div
              key={template.id}
              className="node-item template"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow", "template");
                e.dataTransfer.setData("templateId", template.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => onAddTemplate?.(template)}
            >
              <div className="node-item-icon">
                {template.data.type === "start" && <PlayCircle size={20} color={nodeColors.start} />}
                {template.data.type === "task" && <CheckSquare size={20} color={nodeColors.task} />}
                {template.data.type === "approval" && <UserCheck size={20} color={nodeColors.approval} />}
                {template.data.type === "automated" && <Zap size={20} color={nodeColors.automated} />}
                {template.data.type === "end" && <StopCircle size={20} color={nodeColors.end} />}
              </div>
              <div className="node-item-content">
                <div className="node-item-label">{template.data.label}</div>
                <div className="node-item-description">
                  {String(
                    "title" in template.data
                      ? template.data.title
                      : "endMessage" in template.data
                      ? template.data.endMessage
                      : "Template"
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          workflowTemplates.map((workflow) => (
            <div
              key={workflow.id}
              className="node-item workflow"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow", "workflow");
                e.dataTransfer.setData("workflowId", workflow.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => onLoadWorkflow?.(workflow.id)}
            >
              <div className="node-item-icon workflow-icon">
                <span style={{ fontSize: "24px" }}>{workflow.icon}</span>
              </div>
              <div className="node-item-content">
                <div className="node-item-label">{workflow.name}</div>
                <div className="node-item-description">
                  {workflow.description}
                </div>
                <div className="workflow-meta">
                  {workflow.nodes.length} nodes • {workflow.edges.length}{" "}
                  connections
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
