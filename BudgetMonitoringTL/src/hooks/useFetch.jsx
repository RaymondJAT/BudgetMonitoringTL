import { useState, useEffect } from "react";

const useFetch = (url, options = {}) => {
  const {
    method = "GET",
    body = null,
    headers: customHeaders = {},
    triggerFetch = true,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (bodyData) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      const res = await fetch(url, {
        method,
        headers,
        body: bodyData ? JSON.stringify(bodyData) : null,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();
      console.log("Raw response from useFetch:", result);

      setData(result.data || result);
      return result;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return { error: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.triggerFetch !== false) {
      fetchData();
    }
  }, [url, method, body]);

  return { data, loading, error, triggerFetch: fetchData };
};

export default useFetch;
