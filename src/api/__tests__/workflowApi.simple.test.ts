import { describe, it, expect } from 'vitest';
import { workflowApi } from '../../api/workflowApi';

describe('workflowApi - getAutomations', () => {
  it('should return array of automation actions', async () => {
    const automations = await workflowApi.getAutomations();
    
    expect(Array.isArray(automations)).toBe(true);
    expect(automations.length).toBeGreaterThan(0);
  });

  it('should return automation actions with required properties', async () => {
    const automations = await workflowApi.getAutomations();
    
    automations.forEach(automation => {
      expect(automation).toHaveProperty('id');
      expect(automation).toHaveProperty('label');
      expect(automation).toHaveProperty('params');
      expect(typeof automation.id).toBe('string');
      expect(typeof automation.label).toBe('string');
      expect(Array.isArray(automation.params)).toBe(true);
    });
  });

  it('should include send-email automation', async () => {
    const automations = await workflowApi.getAutomations();
    const sendEmail = automations.find(a => a.id === 'send_email');
    
    expect(sendEmail).toBeDefined();
    expect(sendEmail?.label).toBe('Send Email');
  });

  it('should include create-document automation', async () => {
    const automations = await workflowApi.getAutomations();
    const createDoc = automations.find(a => a.id === 'generate_doc');
    
    expect(createDoc).toBeDefined();
    expect(createDoc?.label).toBe('Generate Document');
  });
});
