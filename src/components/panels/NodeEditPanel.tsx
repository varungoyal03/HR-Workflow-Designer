import { useState, useEffect } from 'react';
import type { WorkflowNode, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types/workflow.types';
import { useAutomations } from '../../hooks/useAutomations';
import { X, Plus, Trash2 } from 'lucide-react';
import './NodeEditPanel.css';

interface NodeEditPanelProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

export default function NodeEditPanel({ node, onUpdate, onClose, onDelete }: NodeEditPanelProps) {
  return (
    <div className="node-edit-panel">
      <div className="panel-header">
        <h3>Edit {node.data.type} Node</h3>
        <button onClick={onClose} className="close-btn" title="Close">
          <X size={18} />
        </button>
      </div>
      
      <div className="panel-content">
        {renderForm(node, onUpdate)}
      </div>
      
      <div className="panel-footer">
        <button 
          onClick={() => onDelete(node.id)} 
          className="delete-btn"
        >
          <Trash2 size={16} />
          Delete Node
        </button>
      </div>
    </div>
  );
}

function renderForm(node: WorkflowNode, onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void) {
  switch (node.data.type) {
    case 'start':
      return <StartNodeForm node={node} onUpdate={onUpdate} />;
    case 'task':
      return <TaskNodeForm node={node} onUpdate={onUpdate} />;
    case 'approval':
      return <ApprovalNodeForm node={node} onUpdate={onUpdate} />;
    case 'automated':
      return <AutomatedNodeForm node={node} onUpdate={onUpdate} />;
    case 'end':
      return <EndNodeForm node={node} onUpdate={onUpdate} />;
  }
}

// Start Node Form
function StartNodeForm({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void }) {
  const data = node.data as StartNodeData;
  const [title, setTitle] = useState(data.title);
  const [metadata, setMetadata] = useState(data.metadata || {});

  const handleUpdate = () => {
    onUpdate(node.id, { title, label: title, metadata });
  };

  const addMetadata = () => {
    setMetadata({ ...metadata, '': '' });
  };

  const updateMetadata = (oldKey: string, newKey: string, value: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[oldKey];
    newMetadata[newKey] = value;
    setMetadata(newMetadata);
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[key];
    setMetadata(newMetadata);
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label>Start Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          placeholder="e.g., New Employee Onboarding"
        />
      </div>

      <div className="form-group">
        <label>Metadata (Key-Value Pairs)</label>
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="key-value-pair">
            <input
              type="text"
              placeholder="Key"
              value={key}
              onChange={(e) => updateMetadata(key, e.target.value, value)}
              onBlur={handleUpdate}
            />
            <input
              type="text"
              placeholder="Value"
              value={value}
              onChange={(e) => updateMetadata(key, key, e.target.value)}
              onBlur={handleUpdate}
            />
            <button onClick={() => { removeMetadata(key); handleUpdate(); }} className="icon-btn">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button onClick={addMetadata} className="add-btn">
          <Plus size={16} /> Add Metadata
        </button>
      </div>
    </div>
  );
}

// Task Node Form
function TaskNodeForm({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void }) {
  const data = node.data as TaskNodeData;
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description || '');
  const [assignee, setAssignee] = useState(data.assignee || '');
  const [dueDate, setDueDate] = useState(data.dueDate || '');
  const [customFields, setCustomFields] = useState(data.customFields || {});

  const handleUpdate = () => {
    onUpdate(node.id, { title, label: title, description, assignee, dueDate, customFields });
  };

  const addCustomField = () => {
    setCustomFields({ ...customFields, '': '' });
  };

  const updateCustomField = (oldKey: string, newKey: string, value: string) => {
    const newFields = { ...customFields };
    delete newFields[oldKey];
    newFields[newKey] = value;
    setCustomFields(newFields);
  };

  const removeCustomField = (key: string) => {
    const newFields = { ...customFields };
    delete newFields[key];
    setCustomFields(newFields);
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label>Task Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          placeholder="e.g., Complete Background Check"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleUpdate}
          placeholder="Task details..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Assignee</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          onBlur={handleUpdate}
          placeholder="e.g., HR Manager"
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          onBlur={handleUpdate}
        />
      </div>

      <div className="form-group">
        <label>Custom Fields</label>
        {Object.entries(customFields).map(([key, value]) => (
          <div key={key} className="key-value-pair">
            <input
              type="text"
              placeholder="Field name"
              value={key}
              onChange={(e) => updateCustomField(key, e.target.value, value)}
              onBlur={handleUpdate}
            />
            <input
              type="text"
              placeholder="Value"
              value={value}
              onChange={(e) => updateCustomField(key, key, e.target.value)}
              onBlur={handleUpdate}
            />
            <button onClick={() => { removeCustomField(key); handleUpdate(); }} className="icon-btn">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button onClick={addCustomField} className="add-btn">
          <Plus size={16} /> Add Custom Field
        </button>
      </div>
    </div>
  );
}

// Approval Node Form
function ApprovalNodeForm({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void }) {
  const data = node.data as ApprovalNodeData;
  const [title, setTitle] = useState(data.title);
  const [approverRole, setApproverRole] = useState(data.approverRole);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(data.autoApproveThreshold || 0);

  const handleUpdate = () => {
    onUpdate(node.id, { title, label: title, approverRole, autoApproveThreshold });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label>Approval Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          placeholder="e.g., Manager Approval"
        />
      </div>

      <div className="form-group">
        <label>Approver Role *</label>
        <select
          value={approverRole}
          onChange={(e) => { setApproverRole(e.target.value); }}
          onBlur={handleUpdate}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="C-Level">C-Level</option>
        </select>
      </div>

      <div className="form-group">
        <label>Auto-Approve Threshold (Amount)</label>
        <input
          type="number"
          value={autoApproveThreshold}
          onChange={(e) => setAutoApproveThreshold(Number(e.target.value))}
          onBlur={handleUpdate}
          placeholder="0"
          min="0"
        />
        <small>Automatically approve if amount is below this threshold</small>
      </div>
    </div>
  );
}

// Automated Node Form
function AutomatedNodeForm({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void }) {
  const data = node.data as AutomatedNodeData;
  const { automations, loading } = useAutomations();
  const [title, setTitle] = useState(data.title);
  const [actionId, setActionId] = useState(data.actionId || '');
  const [parameters, setParameters] = useState(data.parameters || {});

  const selectedAction = automations.find(a => a.id === actionId);

  const handleUpdate = () => {
    const actionLabel = selectedAction?.label || '';
    onUpdate(node.id, { title, label: title, actionId, actionLabel, parameters });
  };

  useEffect(() => {
    if (selectedAction && actionId) {
      const newParams: Record<string, string> = {};
      selectedAction.params.forEach(param => {
        newParams[param] = '';
      });
      setParameters(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionId]);

  const updateParameter = (key: string, value: string) => {
    setParameters({ ...parameters, [key]: value });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label>Automation Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="form-group">
        <label>Select Action *</label>
        <select
          value={actionId}
          onChange={(e) => { setActionId(e.target.value); }}
          onBlur={handleUpdate}
          disabled={loading}
        >
          <option value="">Select an automation...</option>
          {automations.map(action => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
        {selectedAction && (
          <small>{selectedAction.description}</small>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label>Action Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param} className="param-field">
              <label>{param}</label>
              <input
                type="text"
                value={parameters[param] || ''}
                onChange={(e) => updateParameter(param, e.target.value)}
                onBlur={handleUpdate}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// End Node Form
function EndNodeForm({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void }) {
  const data = node.data as EndNodeData;
  const [endMessage, setEndMessage] = useState(data.endMessage);
  const [summaryFlag, setSummaryFlag] = useState(data.summaryFlag || false);

  const handleUpdate = (message: string, summary: boolean) => {
    onUpdate(node.id, { endMessage: message, label: message, summaryFlag: summary });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label>End Message *</label>
        <input
          type="text"
          value={endMessage}
          onChange={(e) => setEndMessage(e.target.value)}
          onBlur={() => handleUpdate(endMessage, summaryFlag)}
          placeholder="e.g., Onboarding Complete"
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={summaryFlag}
            onChange={(e) => { 
              const newValue = e.target.checked;
              setSummaryFlag(newValue);
              handleUpdate(endMessage, newValue);
            }}
          />
          <span>Generate Summary Report</span>
        </label>
        <small>When enabled, a summary report will be generated at workflow completion</small>
      </div>
    </div>
  );
}
