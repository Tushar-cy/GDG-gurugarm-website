import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import activityLogger, { ActivityLogEntry } from '../utils/activityLogger';

/**
 * React hook for activity logging
 * Provides easy integration with React components
 */
export const useActivityLogger = () => {
  const location = useLocation();

  // Log navigation changes
  useEffect(() => {
    activityLogger.logNavigation(
      location.pathname,
      location.pathname,
      {
        search: location.search,
        hash: location.hash,
        state: location.state
      }
    );
  }, [location]);

  // Log user action helper
  const logUserAction = useCallback((
    component: string,
    action: string,
    description: string,
    metadata?: Record<string, any>
  ) => {
    activityLogger.logUserAction(component, action, description, metadata);
  }, []);

  // Log error helper
  const logError = useCallback((
    component: string,
    error: Error | string,
    context?: Record<string, any>
  ) => {
    activityLogger.logError(component, error, context);
  }, []);

  // Log performance helper
  const logPerformance = useCallback((
    operation: string,
    duration: number,
    component: string,
    metadata?: Record<string, any>
  ) => {
    activityLogger.logPerformance(operation, duration, component, metadata);
  }, []);

  // Log API call helper
  const logApiCall = useCallback((
    endpoint: string,
    method: string,
    status: number,
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    activityLogger.logApiCall(endpoint, method, status, duration, metadata);
  }, []);

  // Get logs helper
  const getLogs = useCallback(() => {
    return activityLogger.getLogs();
  }, []);

  // Get logs by type helper
  const getLogsByType = useCallback((type: ActivityLogEntry['type']) => {
    return activityLogger.getLogsByType(type);
  }, []);

  // Clear logs helper
  const clearLogs = useCallback(() => {
    activityLogger.clearLogs();
  }, []);

  // Export logs helper
  const exportLogs = useCallback(() => {
    return activityLogger.exportLogs();
  }, []);

  // Get session info helper
  const getSessionInfo = useCallback(() => {
    return activityLogger.getSessionInfo();
  }, []);

  return {
    logUserAction,
    logError,
    logPerformance,
    logApiCall,
    getLogs,
    getLogsByType,
    clearLogs,
    exportLogs,
    getSessionInfo
  };
};

export default useActivityLogger;