import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom React hook for sending requests.
 * @returns HTTP Object { isLoading: boolean, error: Object, sendRequest: fun, clearError: fun }
 */
export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const activeHttpRequests = useRef([]); // Keep an array of active requests.

  useEffect(() => {
    return () => {
      // Cleanup.
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      let response;
      try {
        response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
}
