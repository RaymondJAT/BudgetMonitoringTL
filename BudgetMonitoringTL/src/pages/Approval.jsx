import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { mockData } from "../mock-data/mockData";
import { tableData } from "../mock-data/tableData";
import Header from "../components/Header";
import Swal from "sweetalert2";
import HeaderCount from "../components/HeaderCount";
import Sidebar from "../components/Sidebar";
import ExpenseReport from "../components/ExpenseReport";
import loader from "../assets/5Lloading.gif";

const Approval = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(mockData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Filter only approved data
  const approvedData = useMemo(() => {
    return data.filter((row) => row.status === "Approved");
  }, [data]);

  // Delete function
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prevData) =>
          prevData.filter((row) => !selectedRows.includes(row))
        );
        setSelectedRows([]);
        Swal.fire("Deleted!", "Selected items have been deleted.", "success");
      }
    });
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

  const handleRowClick = (rowData) => {
    setLoading(true);
    setTimeout(() => navigate("/approval", { state: rowData }), 1000);
  };

  const handleCheckBoxChange = (row) => {
    setSelectedRows((prev) =>
      prev.includes.apply(row)
        ? prev.filter((item) => item !== row)
        : [...prev, row]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === mockData.length ? [] : [...mockData]
    );
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) => row.status === "Approved")
      .filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [searchTerm, selectedStatuses, data]);

  // Helper function to find transactions of an employee
  const getEmployeeTransactions = (employeeName) => {
    return (
      tableData.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  const getTotalAmountByStatus = (status) => {
    return (
      data
        .filter((row) => row.status === status)
        .reduce((sum, row) => {
          const transactions = getEmployeeTransactions(row.employee) || [];
          const grandTotal = transactions.reduce(
            (total, item) => total + (item.quantity * item.price || 0),
            0
          );
          return sum + grandTotal;
        }, 0) || 0
    );
  };

  return (
    <>
      {loading && (
        <div className="loading">
          <img src={loader} alt="loading GIF" className="custom-loader" />
        </div>
      )}
      <Header
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handlePrint={handlePrint}
        handleDelete={handleDelete}
      />
      <div>
        <div className="card-header text-center">
          <HeaderCount
            approvedTotal={getTotalAmountByStatus("Approved")}
            pendingTotal={getTotalAmountByStatus("Pending")}
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
                  <ApprovalTable
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

const ApprovalTable = ({
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
          <ApprovalRow
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

const ApprovalRow = ({
  row,
  isSelected,
  handleRowClick,
  handleCheckBoxChange,
  getEmployeeTransactions,
}) => {
  const transactions = getEmployeeTransactions(row.employee);
  const prices = transactions
    .map(
      (t) => `₱${t.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    )
    .join("\n");
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
      <td>
        ₱{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </td>
      <td>
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      </td>
    </tr>
  );
};

export default Approval;
