/**
 * WebMCP Polyfill & Runtime Manager
 * 
 * Ensures `document.modelContext.registerTool` is available in standard browser
 * environments while maintaining full compatibility with WebMCP-enabled browsers/agents.
 */

class WebMCPContext {
  constructor() {
    this.isLocalDemoAdapter = true;
    this.tools = new Map();
    this.executionHistory = [];
    this.listeners = new Set();
  }

  /**
   * Imperative WebMCP tool registration
   * @param {Object} toolDefinition
   * @param {string} toolDefinition.name - Tool identifier
   * @param {string} toolDefinition.description - Purpose of the tool
   * @param {Object} toolDefinition.inputSchema - JSON schema of parameters
   * @param {Function} toolDefinition.execute - Async/sync execution function
   */
  registerTool(toolDefinition) {
    if (!toolDefinition || !toolDefinition.name) {
      throw new Error('WebMCP: tool definition requires a valid name');
    }

    const tool = {
      name: toolDefinition.name,
      description: toolDefinition.description || '',
      inputSchema: toolDefinition.inputSchema || toolDefinition.parameters || { type: 'object', properties: {} },
      execute: toolDefinition.execute || (async () => ({})),
      registeredAt: new Date().toISOString()
    };

    this.tools.set(tool.name, tool);
    this._notify();
    console.info(`[WebMCP] Registered tool: ${tool.name}`);
    return tool;
  }

  /**
   * Get all registered tools
   */
  getTools() {
    return Array.from(this.tools.values());
  }

  /**
   * Execute a tool by name
   */
  async executeTool(name, params = {}) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`WebMCP: Tool "${name}" is not registered`);
    }

    const startTime = performance.now();
    try {
      const result = await tool.execute(params);
      const durationMs = Math.round(performance.now() - startTime);

      const record = {
        id: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        toolName: name,
        params,
        result,
        status: 'success',
        durationMs,
        timestamp: new Date().toISOString()
      };

      this.executionHistory.unshift(record);
      this._notify();
      return result;
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      const record = {
        id: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        toolName: name,
        params,
        error: err.message,
        status: 'error',
        durationMs,
        timestamp: new Date().toISOString()
      };

      this.executionHistory.unshift(record);
      this._notify();
      throw err;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (e) {
        console.error('[WebMCP] Notification error:', e);
      }
    }
  }
}

// Initialize document.modelContext if not already provided by host environment
export function initWebMCP() {
  if (typeof window !== 'undefined') {
    if (!window.document.modelContext) {
      window.document.modelContext = new WebMCPContext();
    }
    return window.document.modelContext;
  }
  return null;
}
