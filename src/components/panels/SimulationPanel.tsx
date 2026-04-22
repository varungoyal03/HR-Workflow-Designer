import { useState, useCallback } from 'react';
import type { SimulationResult } from '../../types/api.types';
import { workflowApi } from '../../api/workflowApi';
import type { WorkflowNode, WorkflowEdge } from '../../types/workflow.types';
import { validateWorkflow } from '../../utils/workflowValidation';
import { Play, X, CheckCircle, XCircle, Clock, AlertCircle, FileText, Download } from 'lucide-react';
import './SimulationPanel.css';

interface SimulationPanelProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onClose: () => void;
}

export default function SimulationPanel({ nodes, edges, onClose }: SimulationPanelProps) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const runSimulation = useCallback(async () => {
    // Validate first
    const validation = validateWorkflow(nodes, edges);
    if (!validation.isValid) {
      alert('Workflow has validation errors. Please fix them before running simulation.');
      return;
    }

    setLoading(true);
    setResult(null);
    setCurrentStep(0);

    try {
      const simulationResult = await workflowApi.simulateWorkflow({
        workflow: { nodes, edges }
      });
      
      setResult(simulationResult);
      
      // Animate steps
      simulationResult.steps.forEach((_, index) => {
        setTimeout(() => setCurrentStep(index + 1), (index + 1) * 500);
      });
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  return (
    <div className="simulation-panel">
      <div className="panel-header">
        <h3>Test Workflow</h3>
        <button onClick={onClose} className="close-btn" title="Close">
          <X size={18} />
        </button>
      </div>

      <div className="panel-content">
        <div className="simulation-controls">
          <button 
            onClick={runSimulation} 
            disabled={loading || nodes.length === 0}
            className="run-btn"
          >
            <Play size={16} />
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
          
          <div className="workflow-stats">
            <div className="stat">
              <span className="stat-label">Nodes:</span>
              <span className="stat-value">{nodes.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Connections:</span>
              <span className="stat-value">{edges.length}</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="simulation-results">
            <div className={`result-status ${result.status}`}>
              {result.status === 'success' && <CheckCircle size={20} />}
              {result.status === 'failed' && <XCircle size={20} />}
              {result.status === 'partial' && <AlertCircle size={20} />}
              <div>
                <div className="status-title">{result.summary}</div>
                <div className="status-meta">
                  Execution time: {result.executionTime}ms
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="error-list">
                <h4>Errors:</h4>
                {result.errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                ))}
              </div>
            )}

            {result.summaryReport && (
              <div className="summary-report">
                <div className="summary-report-header">
                  <h4>
                    <FileText size={16} />
                    Summary Report
                  </h4>
                  <button 
                    className="download-report-btn"
                    onClick={() => {
                      const blob = new Blob([result.summaryReport!], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `workflow-summary-${Date.now()}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    title="Download Report"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
                <pre className="report-content">{result.summaryReport}</pre>
              </div>
            )}

            <div className="steps-timeline">
              <h4>Execution Steps:</h4>
              {result.steps.map((step, index) => (
                <div 
                  key={step.nodeId}
                  className={`step-item ${step.status} ${index < currentStep ? 'visible' : ''}`}
                >
                  <div className="step-indicator">
                    {step.status === 'completed' && <CheckCircle size={16} />}
                    {step.status === 'failed' && <XCircle size={16} />}
                    {step.status === 'executing' && <Clock size={16} />}
                    <div className="step-number">{step.stepNumber}</div>
                  </div>
                  
                  <div className="step-content">
                    <div className="step-header">
                      <span className="step-type">{step.nodeType}</span>
                      <span className="step-title">{step.nodeTitle}</span>
                    </div>
                    <div className="step-details">{step.details}</div>
                    {step.error && (
                      <div className="step-error">⚠️ {step.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="empty-state">
            <Play size={48} strokeWidth={1.5} />
            <p>Click "Run Simulation" to test your workflow</p>
            <small>This will validate and execute your workflow step-by-step</small>
          </div>
        )}
      </div>
    </div>
  );
}
