import { useMemo } from "react";
import { Table } from "react-bootstrap";

const AllocationTable = ({
  transactions = [],
  sortConfig = { key: null, direction: "asc" },
  setSortConfig = () => {},
  height = "200px",
}) => {
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

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
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="trash-wrapper overflow-auto" style={{ maxHeight: height }}>
      <Table hover className="expense-table mb-0">
        <thead>
          <tr className="align-middle">
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID
            </th>
            <th
              onClick={() => handleSort("date_issue")}
              style={{ cursor: "pointer" }}
            >
              Date Issued
            </th>
            <th
              onClick={() => handleSort("received_by")}
              style={{ cursor: "pointer" }}
            >
              Received By
            </th>
            <th>Description</th>
            <th>Particulars</th>
            <th
              onClick={() => handleSort("amount_issue")}
              style={{ cursor: "pointer" }}
            >
              Amount Issued
            </th>
            <th>Cash Voucher</th>
            <th>Amount Returned</th>
            <th>Outstanding Amount</th>
            <th>Amount Expended</th>
            <th>Status</th>
            <th>Date Liquidated</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.date_issue || "—"}</td>
                <td>{tx.received_by || "—"}</td>
                <td>{tx.description || "—"}</td>
                <td>{tx.particulars || "—"}</td>
                <td>
                  ₱{" "}
                  {parseFloat(tx.amount_issue || 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>{tx.cash_voucher || "—"}</td>
                <td>
                  ₱{" "}
                  {parseFloat(tx.amount_return || 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  ₱{" "}
                  {parseFloat(tx.outstanding_amount || 0).toLocaleString(
                    "en-PH",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td>
                  ₱{" "}
                  {parseFloat(tx.amount_expend || 0).toLocaleString("en-PH", {
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
                <td>{tx.date_liquidated || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center text-muted">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AllocationTable;
