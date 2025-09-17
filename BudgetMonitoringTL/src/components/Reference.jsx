import { useEffect, useState } from "react";

const Reference = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferences = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        console.log("Fetching ALL liquidation references");

        const res = await fetch(
          `/api5012/liquidation_item/getliquidation_item`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch references");

        const data = await res.json();
        console.log("API references response:", data);

        setReferences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching liquidation references:", err);
        setError(err.message);
        setReferences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, []);

  return (
    <div className="custom-container border p-3 rounded h-100">
      <p className="small-input fw-bold mb-2">Transportation Reference</p>

      {loading && <p className="small-input text-muted">Loading...</p>}

      {error && (
        <p className="small-input text-danger">
          Failed to load references: {error}
        </p>
      )}

      {!loading && !error && references.length === 0 && (
        <p className="small-input text-muted">
          No transportation data available.
        </p>
      )}

      {!loading && !error && references.length > 0 && (
        <div className="d-flex flex-column gap-3 pb-3">
          {references.map((item, index) => (
            <div
              key={index}
              className="border rounded p-2 shadow-sm small-input"
            >
              <div className="mb-1">
                <strong>From:</strong> {item.started_from}
              </div>
              <div className="mb-1">
                <strong>To:</strong> {item.ended_to}
              </div>
              <div className="mb-1">
                <strong>Mode of Transportation:</strong>{" "}
                {item.mode_of_transportation}
              </div>
              <div>
                <strong>Amount:</strong> ₱
                {parseFloat(item.amount || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reference;
