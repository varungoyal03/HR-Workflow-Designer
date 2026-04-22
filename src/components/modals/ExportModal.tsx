import { useState } from 'react';
import { X, FileJson, Download } from 'lucide-react';
import './ExportModal.css';

interface ExportModalProps {
  onConfirm: (filename: string) => void;
  onCancel: () => void;
}

export default function ExportModal({ onConfirm, onCancel }: ExportModalProps) {
  const [filename, setFilename] = useState(() => `workflow-${Date.now()}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultName = `workflow-${Date.now()}`;
    const trimmedName = filename.trim() || defaultName;
    const exportFilename = trimmedName.endsWith('.json') ? trimmedName : `${trimmedName}.json`;
    onConfirm(exportFilename);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FileJson size={20} />
            <h3>Export Workflow</h3>
          </div>
          <button onClick={onCancel} className="modal-close-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="filename">Filename</label>
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter workflow filename"
                autoFocus
              />
              <small>The .json extension will be added automatically</small>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="modal-btn cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn primary">
              <Download size={16} />
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
