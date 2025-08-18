import { useState } from "react";
import { Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

import ViewBudgetAllocation from "../ui/modal/admin/ViewBudgetAllocation";
import AppButton from "../ui/AppButton";

const BudgetTable = ({ data, height }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const handleView = (item) => {
    setViewItem(null);
    setTimeout(() => {
      setViewItem(item.id);
      setShowViewModal(true);
    }, 0);
  };

  const renderRows = () =>
    data.map((item, index) => {
      const amount = Number(item.remaining_budget) || 0;
      const used = Number(item.issued_amount) || 0;
      const remaining = Number(item.remaining_amount) || 0;
      const utilization = amount > 0 ? ((used / amount) * 100).toFixed(2) : 0;

      return (
        <tr key={item.id || index}>
          <td>{item.date}</td>
          <td>{item.department}</td>
          <td>₱ {amount.toLocaleString()}</td>
          <td>₱ {used.toLocaleString()}</td>
          <td>₱ {remaining.toLocaleString()}</td>
          <td>{utilization}%</td>
          <td>
            <AppButton
              label={
                <>
                  <FaEye />
                </>
              }
              variant="outline-dark"
              size="sm"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => handleView(item)}
              title="View Budget Details"
              className="custom-app-button"
            />
          </td>
        </tr>
      );
    });

  return (
    <>
      <p className="fw-bold mb-2">🏛️ Department Budget</p>
      <div
        className="table-wrapper overflow-auto"
        style={{ maxHeight: height }}
      >
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Department</th>
              <th>Allocated Budget</th>
              <th>Used Amount</th>
              <th>Remaining</th>
              <th>Utilization (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              renderRows()
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No budget data available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Mobile View */}
        <div className="d-lg-none">
          {data.length > 0 ? (
            data.map((item, index) => {
              const amount = Number(item.amount) || 0;
              const used = Number(item.used) || 0;
              const remaining = amount - used;
              const utilization =
                amount > 0 ? ((used / amount) * 100).toFixed(2) : "0.00";

              return (
                <div key={item.id || index} className="mobile-card">
                  <div className="mobile-card-header">
                    <span className="fw-bold">{item.department}</span>
                  </div>

                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Allocated:</span>{" "}
                    <span className="mobile-card-value">
                      ₱ {amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Used:</span>{" "}
                    <span className="mobile-card-value">
                      ₱ {used.toLocaleString()}
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Remaining:</span>{" "}
                    <span className="mobile-card-value">
                      ₱ {remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Utilization:</span>{" "}
                    <span className="mobile-card-value">{utilization}%</span>
                  </div>

                  <div className="mobile-card-item d-flex gap-2 mt-2">
                    <AppButton
                      label={
                        <>
                          <FaEye />
                        </>
                      }
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleView(item)}
                      title="View Budget"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center mt-4">No budget data available.</div>
          )}
        </div>
      </div>

      <ViewBudgetAllocation
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        budgetId={viewItem}
        tableData={data}
      />
    </>
  );
};

export default BudgetTable;
