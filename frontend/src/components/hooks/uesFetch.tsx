
import { useState, useCallback } from "react";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  url: string;
  method?: HTTPMethod;
  body?: unknown;
  customHeaders?: Record<string, string>;
  signal?: AbortSignal | null;
  withLoader?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const useFetch = <T = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async ({
      url,
      method = "GET",
      body = null,
      customHeaders = {},
      signal = null,
      withLoader = true,
    }: RequestOptions): Promise<T | null> => {
      if (withLoader) setLoading(true);

      setError(null);

      try {
        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        const isFormData = body instanceof FormData;

        const headers: Record<string, string> = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...customHeaders,
        };

        if (!isFormData && body !== null && body !== undefined) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}${url}`,
          {
            method,
            headers,
            body:
              body === null || body === undefined
                ? undefined
                : isFormData
                  ? body
                  : JSON.stringify(body),
            signal: signal ?? undefined,
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          const errorResponse = result as ApiErrorResponse;

          const errorMessage =
            errorResponse?.message ||
            errorResponse?.error ||
            `HTTP error: ${response.status}`;

          setError(errorMessage);

          return result as T;
        }

        setData(result as T);

        return result as T;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";

        setError(errorMessage);

        throw err;
      } finally {
        if (withLoader) setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    request,
    reset,
  };
};

export default useFetch;
