import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaEye, FaExchangeAlt } from "react-icons/fa";
import EditBudgetAllocation from "../ui/modal/admin/EditBudgetAllocation";
import TransferBudgetAllocation from "../ui/modal/admin/TransferBudgetAllocation";
import ViewBudgetAllocation from "../ui/modal/admin/ViewBudgetAllocation";

const BudgetTable = ({ data, height, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [transferFrom, setTransferFrom] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleView = (item) => {
    setViewItem(null);
    setTimeout(() => {
      setViewItem(item.id);
      setShowViewModal(true);
    }, 0);
  };

  const handleTransfer = (item) => {
    setTransferFrom(null);
    setTimeout(() => {
      setTransferFrom(item);
      setShowTransferModal(true);
    }, 0);
  };

  const handleEdit = (item) => {
    setSelectedItem(null);
    setTimeout(() => {
      setSelectedItem(item);
      setShowEditModal(true);
    }, 0);
  };

  const handleSaveChanges = (updatedItem) => {
    const updatedTable = data.map((entry) =>
      entry.id === updatedItem.id ? updatedItem : entry
    );
    onUpdate(updatedTable);
    setShowEditModal(false);
  };

  const renderRows = () =>
    tableData.map((item) => {
      const remaining = item.allocated - item.used;
      const utilization = ((item.used / item.allocated) * 100).toFixed(2);

      return (
        <tr key={item.id}>
          <td>{item.department}</td>
          <td>₱ {item.allocated.toLocaleString()}</td>
          <td>₱ {item.used.toLocaleString()}</td>
          <td>₱ {remaining.toLocaleString()}</td>
          <td>{utilization}%</td>
          <td>
            <Button
              variant="outline-dark"
              size="sm"
              className="me-2"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => handleTransfer(item)}
              title="Transfer Funds"
            >
              <FaExchangeAlt />
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              className="me-2"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => handleEdit(item)}
            >
              <FaEdit />
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => handleView(item)}
              title="View Budget Details"
            >
              <FaEye />
            </Button>
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
              <th>Department</th>
              <th>Allocated Budget</th>
              <th>Used Amount</th>
              <th>Remaining</th>
              <th>Utilization (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              renderRows()
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No budget data available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Mobile View */}
        <div className="d-lg-none">
          {tableData.length > 0 ? (
            tableData.map((item, index) => {
              const remaining = item.allocated - item.used;
              const utilization = ((item.used / item.allocated) * 100).toFixed(
                2
              );

              return (
                <div key={item.id || index} className="mobile-card">
                  <div className="mobile-card-header">
                    <span className="fw-bold">{item.department}</span>
                  </div>

                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Allocated:</span>{" "}
                    <span className="mobile-card-value">
                      ₱ {item.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Used:</span>{" "}
                    <span className="mobile-card-value">
                      ₱ {item.used.toLocaleString()}
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
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleTransfer(item)}
                      title="Transfer Funds"
                    >
                      <FaExchangeAlt />
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      title="Edit Budget"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleView(item)}
                      title="View Budget"
                    >
                      <FaEye />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center mt-4">No budget data available.</div>
          )}
        </div>
      </div>

      <TransferBudgetAllocation
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        fromDepartment={transferFrom}
        departments={tableData}
        onTransfer={(updatedTable) => {
          onUpdate(updatedTable);
          setShowTransferModal(false);
        }}
      />

      <EditBudgetAllocation
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        budgetItem={selectedItem}
        onSave={handleSaveChanges}
      />

      <ViewBudgetAllocation
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        budgetId={viewItem}
        tableData={tableData}
      />
    </>
  );
};

export default BudgetTable;
