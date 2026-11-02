import { useState, useCallback } from "react";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  url: string;
  method?: HTTPMethod;
  body?: any;
  customHeaders?: Record<string, string>;
  signal?: AbortSignal | null;
  withLoader?: boolean;
}


const useFetch = <T = any>() => {

  const [data, setData] = useState<T | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const request = useCallback(async ({ url, method = "GET", body = null, customHeaders = {}, signal = null, withLoader = true }: RequestOptions): Promise<T | null> => {
    if (withLoader) setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem('auth_token');
      const isFormData = body instanceof FormData;

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token ?? ""}`,
        ...customHeaders,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
        method,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : null,
        ...(signal ? { signal } : {}),
        credentials: "include",
      });
      const result: T = await response.json();

      if (!response.ok) {
        const errorMessage = (result as any)?.message || (result as any)?.error || `HTTP error: ${response.status}`;

        setError(errorMessage);
       
        return result;
      }

      setData(result);
      return result;
    } catch (err) {
      if ((err as Error).name === "AbortError") return null;
      setError((err as Error).message);
      throw err;
    } finally {
      if (withLoader) setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
};

export default useFetch;
