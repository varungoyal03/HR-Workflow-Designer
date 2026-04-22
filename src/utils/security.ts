/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validates workflow node count to prevent DoS
 */
export function validateWorkflowSize(nodeCount: number, edgeCount: number): boolean {
  return nodeCount <= 1000 && edgeCount <= 2000;
}

/**
 * Validates JSON structure for workflow import
 */
export function validateWorkflowJSON(data: unknown): data is { nodes: unknown[]; edges: unknown[] } {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  return (
    Array.isArray(obj.nodes) &&
    Array.isArray(obj.edges) &&
    obj.nodes.length <= 1000 &&
    obj.edges.length <= 2000
  );
}

/**
 * Validates file size
 */
export function validateFileSize(content: string, maxSizeMB: number = 5): boolean {
  return content.length <= maxSizeMB * 1024 * 1024;
}

/**
 * Safe JSON parse with validation
 */
export function safeJSONParse<T>(json: string, validator: (data: unknown) => data is T): T | null {
  try {
    const data = JSON.parse(json);
    return validator(data) ? data : null;
  } catch {
    return null;
  }
}
