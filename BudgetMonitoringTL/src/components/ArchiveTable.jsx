import React, { useMemo } from "react";
import { Card } from "react-bootstrap";

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
);

const ArchiveTable = ({
  data,
  selectedRows,
  handleCheckBoxChange,
  handleSelectAll,
}) => {
  // ✅ Archive map from localStorage
  const employeeTransactionsMap = useMemo(() => {
    const archiveData = JSON.parse(localStorage.getItem("archiveData")) || [];
    const map = {};
    archiveData.forEach((t) => {
      if (!map[t.employee]) {
        map[t.employee] = [];
      }
      map[t.employee].push(t);
    });
    return map;
  }, []);

  const formattedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .map((row) => {
        const transactions = employeeTransactionsMap[row.employee] || [];
        return {
          ...row,
          prices: transactions
            .map(
              (t) =>
                `₱${t.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`
            )
            .join("\n"),
          quantities: transactions.map((t) => t.quantity).join("\n"),
          grandTotal: transactions.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          ),
        };
      })
      .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
  }, [data, employeeTransactionsMap]);

  return (
    <Card className="w-auto">
      <Card.Body className="p-0">
        <div className="content-containers">
          <div className="content-container">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e)}
                        checked={
                          Array.isArray(selectedRows) &&
                          Array.isArray(data) &&
                          selectedRows.length === data.length &&
                          data.length > 0
                        }
                      />
                    </th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Description</th>
                    <th>Expense Date</th>
                    <th>Category</th>
                    <th>Paid By</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.map((row) => {
                    const isSelected = selectedRows.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`custom-table-row text-center ${
                          isSelected ? "highlighted-row" : ""
                        }`}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCheckBoxChange(row.id)}
                          />
                        </td>
                        <td>{row.employee}</td>
                        <td>{row.department}</td>
                        <td>{row.description}</td>
                        <td>{row.expenseDate}</td>
                        <td>{row.category}</td>
                        <td>{row.paidBy}</td>
                        <td className="hidden-column">
                          <pre>{row.prices}</pre>
                        </td>
                        <td className="hidden-column">
                          <pre>{row.quantities}</pre>
                        </td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>
                          ₱
                          {row.grandTotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArchiveTable;
