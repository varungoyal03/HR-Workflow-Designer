import { useState, useEffect, useCallback } from 'react';
import type { AutomationAction } from '../types/api.types';
import { workflowApi } from '../api/workflowApi';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAutomations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workflowApi.getAutomations();
      setAutomations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load automations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

  return { automations, loading, error, reload: loadAutomations };
}
