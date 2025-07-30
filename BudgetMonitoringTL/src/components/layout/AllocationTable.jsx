import { useMemo } from "react";
import { Table } from "react-bootstrap";

const AllocationTable = ({
  budgetId,
  tableData = [],
  sortConfig,
  setSortConfig,
  filters,
  height = "200px", // default height if not provided
}) => {
  const transactions =
    tableData.find((item) => item.id === budgetId)?.transactions || [];

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => {
      const matchesReference =
        tx.referenceId
          ?.toLowerCase()
          .includes(filters.referenceId.toLowerCase()) ?? true;

      const matchesAmount = filters.amount
        ? parseFloat(tx.amount || 0) >= parseFloat(filters.amount)
        : true;

      const matchesDate = filters.date ? tx.date === filters.date : true;

      return matchesReference && matchesAmount && matchesDate;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig, transactions]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <>
      <div
        className="trash-wrapper overflow-auto"
        style={{ maxHeight: height }}
      >
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              {/* <th>Type</th> */}
              <th
                onClick={() => handleSort("referenceId")}
                style={{ cursor: "pointer" }}
              >
                Reference ID {renderSortIcon("referenceId")}
              </th>
              <th>Employee</th>
              <th>Department</th>
              <th>Description</th>
              <th
                onClick={() => handleSort("amount")}
                style={{ cursor: "pointer" }}
              >
                Amount {renderSortIcon("amount")}
              </th>
              <th>Status</th>
              <th
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Date {renderSortIcon("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => (
                <tr key={idx}>
                  {/* <td>{tx.type}</td> */}
                  <td>{tx.referenceId || "—"}</td>
                  <td>{tx.employee || "—"}</td>
                  <td>{tx.department || "—"}</td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {tx.description || "—"}
                  </td>
                  <td>
                    ₱{" "}
                    {parseFloat(tx.amount || 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${String(
                        tx.status
                      ).toLowerCase()}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>{tx.date || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Mobile View */}
        <div className="d-lg-none">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, idx) => (
              <div key={idx} className="mobile-card">
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Reference ID:</span>{" "}
                  <span className="mobile-card-value">{tx.referenceId}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Employee:</span>{" "}
                  <span className="mobile-card-value">
                    {tx.employee || "—"}
                  </span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Department:</span>{" "}
                  <span className="mobile-card-value">
                    {tx.department || "—"}
                  </span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Amount:</span>{" "}
                  <span className="mobile-card-value">
                    ₱{" "}
                    {parseFloat(tx.amount || 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Status:</span>{" "}
                  <span
                    className={`mobile-card-value status-badge ${tx.status.toLowerCase()}`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Date:</span>{" "}
                  <span className="mobile-card-value">{tx.date || "—"}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Description:</span>{" "}
                  <span className="mobile-card-value">
                    {tx.description || "—"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-4">No transactions found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllocationTable;
