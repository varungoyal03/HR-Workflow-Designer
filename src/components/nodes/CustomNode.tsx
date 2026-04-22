import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { WorkflowNodeData } from '../../types/workflow.types';
import { 
  PlayCircle, 
  CheckSquare, 
  UserCheck, 
  Zap, 
  StopCircle 
} from 'lucide-react';
import './CustomNode.css';

interface CustomNodeProps {
  data: WorkflowNodeData;
  selected: boolean;
}

function CustomNode({ data, selected }: CustomNodeProps) {
  const getNodeIcon = () => {
    switch (data.type) {
      case 'start':
        return <PlayCircle size={16} />;
      case 'task':
        return <CheckSquare size={16} />;
      case 'approval':
        return <UserCheck size={16} />;
      case 'automated':
        return <Zap size={16} />;
      case 'end':
        return <StopCircle size={16} />;
    }
  };

  const getNodeColor = () => {
    switch (data.type) {
      case 'start':
        return '#10b981';
      case 'task':
        return '#3b82f6';
      case 'approval':
        return '#f59e0b';
      case 'automated':
        return '#8b5cf6';
      case 'end':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const showTargetHandle = data.type !== 'start';
  const showSourceHandle = data.type !== 'end';

  return (
    <div 
      className={`custom-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: getNodeColor() }}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="custom-handle"
          style={{ background: getNodeColor(), borderColor: 'white' }}
        />
      )}
      
      <div className="custom-node-header" style={{ backgroundColor: getNodeColor() }}>
        <div className="custom-node-icon">
          {getNodeIcon()}
        </div>
        <div className="custom-node-type">{data.type}</div>
      </div>
      
      <div className="custom-node-content">
        <div className="custom-node-title">
          {data.label || 'Untitled'}
        </div>
        {renderNodeDetails(data)}
      </div>

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="custom-handle"
          style={{ background: getNodeColor(), borderColor: 'white' }}
        />
      )}
    </div>
  );
}

function renderNodeDetails(data: WorkflowNodeData) {
  switch (data.type) {
    case 'start':
      return (
        <>
          <div className="node-detail">{data.title}</div>
          {data.metadata && Object.keys(data.metadata).length > 0 && (
            <div className="node-metrics">
              <div className="metric-badge">{Object.keys(data.metadata).length} metadata</div>
            </div>
          )}
        </>
      );
    case 'task':
      return (
        <>
          <div className="node-detail">
            {data.assignee && <div>👤 {data.assignee}</div>}
            {data.dueDate && <div>📅 {data.dueDate}</div>}
          </div>
          {(data.customFields && Object.keys(data.customFields).length > 0) && (
            <div className="node-metrics">
              <div className="metric-badge">{Object.keys(data.customFields).length} fields</div>
            </div>
          )}
        </>
      );
    case 'approval':
      return (
        <>
          <div className="node-detail">👔 {data.approverRole}</div>
          {data.autoApproveThreshold !== undefined && data.autoApproveThreshold > 0 && (
            <div className="node-metrics">
              <div className="metric-badge success">Auto ≤ {data.autoApproveThreshold}</div>
            </div>
          )}
        </>
      );
    case 'automated':
      return (
        <>
          <div className="node-detail">{data.actionLabel || 'Select action'}</div>
          {data.parameters && Object.keys(data.parameters).length > 0 && (
            <div className="node-metrics">
              <div className="metric-badge">{Object.keys(data.parameters).length} params</div>
            </div>
          )}
        </>
      );
    case 'end':
      return (
        <>
          <div className="node-detail">{data.endMessage}</div>
          {data.summaryFlag && (
            <div className="node-metrics">
              <div className="metric-badge success">📊 Summary</div>
            </div>
          )}
        </>
      );
  }
}

export default memo(CustomNode);
