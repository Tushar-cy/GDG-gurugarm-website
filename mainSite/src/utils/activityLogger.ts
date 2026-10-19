/**
 * Frontend Activity Logger
 * Tracks user interactions, API calls, and application events
 */

export interface ActivityLogEntry {
  timestamp: string;
  type: 'USER_ACTION' | 'API_CALL' | 'NAVIGATION' | 'ERROR' | 'PERFORMANCE' | 'SYSTEM';
  component: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: string;
  component: string;
}

class ActivityLogger {
  private logs: ActivityLogEntry[] = [];
  private sessionId: string;
  private userId: string | null = null;
  private isEnabled: boolean = true;
  private maxLogs: number = 1000;
  private apiEndpoint: string = '/api/logs/activity';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserFromStorage();
    this.setupErrorHandling();
    this.setupPerformanceTracking();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load user information from localStorage
   */
  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userId = user.id || user.email || 'anonymous';
      }
    } catch (error) {
      console.warn('Failed to load user from storage:', error);
    }
  }

  /**
   * Set user ID for logging
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('user_id', userId);
  }

  /**
   * Log user action
   */
  public logUserAction(
    component: string,
    action: string,
    description: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'USER_ACTION',
      component,
      action,
      description,
      metadata
    });
  }

  /**
   * Log API call
   */
  public logApiCall(
    endpoint: string,
    method: string,
    status: number,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'API_CALL',
      component: 'API',
      action: `${method} ${endpoint}`,
      description: `API call to ${endpoint} returned ${status}`,
      metadata: {
        endpoint,
        method,
        status,
        duration,
        ...metadata
      }
    });
  }

  /**
   * Log navigation event
   */
  public logNavigation(
    from: string,
    to: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'NAVIGATION',
      component: 'ROUTER',
      action: 'NAVIGATE',
      description: `Navigated from ${from} to ${to}`,
      metadata: {
        from,
        to,
        ...metadata
      }
    });
  }

  /**
   * Log error
   */
  public logError(
    component: string,
    error: Error | string,
    context?: Record<string, any>
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.log({
      type: 'ERROR',
      component,
      action: 'ERROR',
      description: `Error in ${component}: ${errorMessage}`,
      metadata: {
        error: errorMessage,
        stack: errorStack,
        ...context
      }
    });
  }

  /**
   * Log performance metric
   */
  public logPerformance(
    operation: string,
    duration: number,
    component: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'PERFORMANCE',
      component,
      action: 'PERFORMANCE',
      description: `${operation} took ${duration}ms`,
      metadata: {
        operation,
        duration,
        ...metadata
      }
    });
  }

  /**
   * Log system event
   */
  public logSystemEvent(
    event: string,
    description: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'SYSTEM',
      component: 'SYSTEM',
      action: event,
      description,
      metadata
    });
  }

  /**
   * Core logging method
   */
  private log(entry: Omit<ActivityLogEntry, 'timestamp' | 'sessionId' | 'userId'>): void {
    if (!this.isEnabled) return;

    const logEntry: ActivityLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId || 'anonymous'
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ACTIVITY] ${logEntry.type}: ${logEntry.description}`, logEntry);
    }

    // Send to backend if available
    this.sendToBackend(logEntry);
  }

  /**
   * Send log entry to backend
   */
  private async sendToBackend(entry: ActivityLogEntry): Promise<void> {
    try {
      // Only send important logs to reduce network traffic
      if (['ERROR', 'USER_ACTION', 'API_CALL'].includes(entry.type)) {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry)
        });
      }
    } catch (error) {
      console.warn('Failed to send log to backend:', error);
    }
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('GLOBAL', event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('PROMISE', event.reason, {
        promise: event.promise
      });
    });
  }

  /**
   * Setup performance tracking
   */
  private setupPerformanceTracking(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        this.logPerformance('PAGE_LOAD', perfData.loadEventEnd - perfData.loadEventStart, 'PAGE');
      }
    });

    // Track API call performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        this.logApiCall(
          args[0] as string,
          'FETCH',
          response.status,
          duration,
          { url: args[0] }
        );
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        this.logError('FETCH', error as Error, { duration });
        throw error;
      }
    };
  }

  /**
   * Get all logs
   */
  public getLogs(): ActivityLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by type
   */
  public getLogsByType(type: ActivityLogEntry['type']): ActivityLogEntry[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Clear logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.logSystemEvent('CLEAR_LOGS', 'Activity logs cleared');
  }

  /**
   * Enable/disable logging
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.logSystemEvent('LOGGING_TOGGLE', `Logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Export logs as JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get session information
   */
  public getSessionInfo(): { sessionId: string; userId: string | null; logCount: number } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      logCount: this.logs.length
    };
  }
}

// Create singleton instance
export const activityLogger = new ActivityLogger();

// Export for use in components
export default activityLogger;