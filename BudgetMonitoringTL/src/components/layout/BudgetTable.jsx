import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaEye, FaExchangeAlt } from "react-icons/fa";
import EditBudgetAllocation from "../ui/modal/admin/EditBudgetAllocation";
import TransferBudgetAllocation from "../ui/modal/admin/TransferBudgetAllocation";

const BudgetTable = ({ data, height, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [transferFrom, setTransferFrom] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

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
              onClick={() => console.log("View", item)}
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
    </>
  );
};

export default BudgetTable;
