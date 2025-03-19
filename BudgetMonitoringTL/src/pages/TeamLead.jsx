import React, { useState, useRef, useMemo } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";
import { tableData } from "../mock-data/tableData";
import { useReactToPrint } from "react-to-print";
import Header from "../components/Header";
import loader from "../assets/5Lloading.gif";
import Sidebar from "../components/Sidebar";
import HeaderCount from "../components/HeaderCount";
import ExpenseReport from "../components/Sample";

const TeamLead = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Helper function to find transactions of an employee
  const getEmployeeTransactions = (employeeName) => {
    return (
      tableData.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  const handleRowClick = (rowData) => {
    setLoading(true);
    setTimeout(() => navigate("/approval", { state: rowData }), 1000);
  };

  const handleCheckBoxChange = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === mockData.length ? [] : [...mockData]
    );
  };

  // react-to-print
  const handlePrint = () => {
    reactToPrintFn();
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredData = useMemo(() => {
    return mockData
      .filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter(
        (row) =>
          selectedStatuses.length === 0 || selectedStatuses.includes(row.status)
      );
  }, [searchTerm, selectedStatuses]);

  return (
    <>
      {loading && (
        <div className="loading">
          <img src={loader} alt="Loading GIF" className="custom-loader" />
        </div>
      )}

      <Header
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handlePrint={handlePrint}
      />

      <div>
        <div className="card-header text-center">
          <HeaderCount
            pendingCount={
              mockData.filter((row) => row.status === "Pending").length
            }
            approvedCount={
              mockData.filter((row) => row.status === "Approved").length
            }
            postCount={mockData.filter((row) => row.status === "Post").length}
          />
        </div>

        <Card className="w-auto">
          <Card.Body className="p-0">
            <div className="content-containers">
              <div className="content-container">
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  onStatusChange={handleStatusFilterChange}
                />
                <div className="table-container">
                  <ExpenseTable
                    data={filteredData}
                    selectedRows={selectedRows}
                    handleRowClick={handleRowClick}
                    handleCheckBoxChange={handleCheckBoxChange}
                    handleSelectAll={handleSelectAll}
                    getEmployeeTransactions={getEmployeeTransactions}
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div style={{ display: "none" }}>
        <ExpenseReport
          data={
            selectedRows.length > 0
              ? {
                  ...selectedRows[0],
                  items: getEmployeeTransactions(selectedRows[0]?.employee),
                }
              : {}
          }
          contentRef={contentRef}
        />
      </div>
    </>
  );
};

const ExpenseTable = ({
  data,
  selectedRows,
  handleRowClick,
  handleCheckBoxChange,
  handleSelectAll,
  getEmployeeTransactions,
}) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={selectedRows.length === data.length}
            />
          </th>
          <th>Employee</th>
          <th>Department</th>
          <th>Description</th>
          <th>Expense Date</th>
          <th>Category</th>
          <th>Paid By</th>
          <th className="hidden-column">Unit Price</th>
          <th className="hidden-column">Quantity</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <ExpenseRow
            key={index}
            row={row}
            isSelected={selectedRows.includes(row)}
            handleRowClick={handleRowClick}
            handleCheckBoxChange={handleCheckBoxChange}
            getEmployeeTransactions={getEmployeeTransactions}
          />
        ))}
      </tbody>
    </table>
  );
};

const ExpenseRow = ({
  row,
  isSelected,
  handleRowClick,
  handleCheckBoxChange,
  getEmployeeTransactions,
}) => {
  const transactions = getEmployeeTransactions(row.employee);
  const prices = transactions.map((t) => `₱${t.price.toFixed(2)}`).join("\n");
  const quantities = transactions.map((t) => t.quantity).join("\n");
  const grandTotal = transactions.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <tr
      onClick={() => handleRowClick(row)}
      className={`custom-table-row text-center ${
        isSelected ? "highlighted-row" : ""
      }`}
    >
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleCheckBoxChange(row)}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td>{row.employee}</td>
      <td>{row.department}</td>
      <td>{row.description}</td>
      <td>{row.expenseDate}</td>
      <td>{row.category}</td>
      <td>{row.paidBy}</td>
      <td className="hidden-column">
        <pre>{prices}</pre>
      </td>
      <td className="hidden-column">
        <pre>{quantities}</pre>
      </td>
      <td>₱{grandTotal.toFixed(2)}</td>
      <td>
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      </td>
    </tr>
  );
};

export default TeamLead;
