import { useEffect, useState, useMemo } from "react";
import SearchBar from "./SearchBar";

const Reference = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchReferences = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

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

  // FILTER BASED ON SEARCH
  const filteredReferences = useMemo(() => {
    if (!searchValue) return references;

    const lowerSearch = searchValue.toLowerCase();
    return references.filter((item) =>
      [
        item.started_from,
        item.ended_to,
        item.mode_of_transportation,
        item.amount,
      ].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  }, [references, searchValue]);

  return (
    <div className="custom-container border p-3 rounded h-100 d-flex flex-column">
      <p className="small-input fw-bold mb-2">Transportation Reference</p>

      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        size="sm"
        placeholder="Search reference..."
        className="mb-2"
        style={{
          fontSize: "0.75rem",
          padding: "0.25rem 0.5rem",
          height: "30px",
        }}
      />

      {loading && <p className="small-input text-muted">Loading...</p>}

      {error && (
        <p className="small-input text-danger">
          Failed to load references: {error}
        </p>
      )}

      {!loading && !error && filteredReferences.length === 0 && (
        <p className="small-input text-muted">
          No transportation data available.
        </p>
      )}

      {!loading && !error && filteredReferences.length > 0 && (
        <div
          className="trash-wrapper d-flex flex-column gap-3 pb-3 overflow-auto"
          style={{ flex: 1 }}
        >
          {filteredReferences.map((item, index) => (
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
