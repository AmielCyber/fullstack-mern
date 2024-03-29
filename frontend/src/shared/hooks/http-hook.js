import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom React hook for sending requests.
 * @returns HTTP Object { isLoading: boolean, error: Object, sendRequest: fun, clearError: fun }
 */
export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // Stores data across rerender cycles.
  const activeHttpRequests = useRef([]); // Keep an array of active requests.

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      // API browser AbortController
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      let response;
      try {
        response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, // Links this abort controller to this request.
        });
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        if (!httpAbortCtrl.signal.aborted) {
          setError(err.message);
          setIsLoading(false);
          throw err;
        } else {
          return null;
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      // Cleanup each abort controller.
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
}
