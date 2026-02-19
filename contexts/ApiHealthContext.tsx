
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';

interface ApiHealthContextType {
  isVocalStudioApiHealthy: boolean;
  setVocalStudioApiHealthy: (isHealthy: boolean) => void;
  // This is for direct use by components if they need to check or manually trigger retry
  triggerApiHealthCheck: () => void; 
}

const ApiHealthContext = createContext<ApiHealthContextType | undefined>(undefined);

const API_HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const ApiHealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVocalStudioApiHealthy, setIsVocalStudioApiHealthy] = useState(true); // Assume healthy initially
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkApiStatus = useCallback(async () => {
    // In a real scenario, this would be a lightweight endpoint on your backend
    // that pings the external API (TTSPro/Gemini) and returns its status.
    // For this frontend-only app, we'll simulate.
    console.log("Checking Vocal Studio API health...");
    try {
      // Simulate a successful ping most of the time
      // Or, a real ping to a health check endpoint if one existed on ttspro.vercel.app
      const response = await fetch('https://ttspro.vercel.app/api/health-check', { method: 'HEAD' });
      if (response.ok) {
        console.log("Vocal Studio API is healthy.");
        setIsVocalStudioApiHealthy(true);
      } else {
        console.warn(`Vocal Studio API health check failed with status: ${response.status}`);
        setIsVocalStudioApiHealthy(false);
      }
    } catch (error) {
      console.error("Error during Vocal Studio API health check:", error);
      setIsVocalStudioApiHealthy(false);
    }
  }, []);

  const setVocalStudioApiHealthyWrapper = useCallback((isHealthy: boolean) => {
    setIsVocalStudioApiHealthy(isHealthy);
    if (!isHealthy) {
      // If API becomes unhealthy, schedule a retry check
      console.warn("Vocal Studio API reported unhealthy. Scheduling retry...");
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        checkApiStatus(); // Re-check after interval
      }, API_HEALTH_CHECK_INTERVAL);
    } else {
      // If API is healthy, clear any pending retry
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    }
  }, [checkApiStatus]);

  useEffect(() => {
    // Initial health check on mount
    checkApiStatus();
    // Periodically check API status
    const interval = setInterval(checkApiStatus, API_HEALTH_CHECK_INTERVAL);
    return () => {
      clearInterval(interval);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [checkApiStatus]);

  const triggerApiHealthCheck = useCallback(() => {
    checkApiStatus();
  }, [checkApiStatus]);

  return (
    <ApiHealthContext.Provider value={{ isVocalStudioApiHealthy, setVocalStudioApiHealthy: setVocalStudioApiHealthyWrapper, triggerApiHealthCheck }}>
      {children}
    </ApiHealthContext.Provider>
  );
};

export const useApiHealth = (): ApiHealthContextType => {
  const context = useContext(ApiHealthContext);
  if (context === undefined) {
    throw new Error('useApiHealth must be used within an ApiHealthProvider');
  }
  return context;
};
