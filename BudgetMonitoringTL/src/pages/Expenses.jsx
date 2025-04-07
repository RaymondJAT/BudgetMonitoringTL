import React, { useState, useRef, useMemo, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";
import { useReactToPrint } from "react-to-print";
import Header from "../components/Header";
import loader from "../assets/5Lloading.gif";
import Sidebar from "../components/Sidebar";
import HeaderCount from "../components/HeaderCount";
import ExpenseReport from "../components/ExpenseReport";
import Swal from "sweetalert2";

const Expenses = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [data, setData] = useState(mockData);
  const [trashData, setTrashData] = useState([]);

  // const filteredData = useMemo(() => {
  //   return data
  //     .filter((row) => row.status !== "Approved")
  //     .filter((row) =>
  //       Object.values(row).some((value) =>
  //         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     )
  //     .filter(
  //       (row) =>
  //         selectedStatuses.length === 0 || selectedStatuses.includes(row.status)
  //     );
  // }, [searchTerm, selectedStatuses, data]);

  const filteredData = useMemo(() => {
    const trashIds = trashData.map((item) => item.id);

    return data
      .filter((row) => !trashIds.includes(row.id))
      .filter((row) => row.status !== "Approved")
      .filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter(
        (row) =>
          selectedStatuses.length === 0 || selectedStatuses.includes(row.status)
      );
  }, [searchTerm, selectedStatuses, data, trashData]);

  // localstorage
  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem("expensesData"));
  //   setData(storedData || mockData);
  // }, []);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expensesData"));
    const storedTrash = JSON.parse(localStorage.getItem("trashData"));
    const storedSelectedRows = JSON.parse(localStorage.getItem("selectedRows"));

    setData(storedExpenses || mockData); // Default to mockData if not found
    setTrashData(storedTrash || []);
    setSelectedRows(storedSelectedRows || []); // Default to empty array if not found
  }, []);

  // useEffect(() => {
  //   const storedExpenses = JSON.parse(localStorage.getItem("expensesData"));
  //   const storedTrash = JSON.parse(localStorage.getItem("trashData"));

  //   setData(storedExpenses || mockData);
  //   setTrashData(storedTrash || []);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("trashData", JSON.stringify(trashData));
  // }, [trashData]);

  // useEffect(() => {
  //   localStorage.setItem("expensesData", JSON.stringify(data));
  // }, [data]);

  // reset
  // useEffect(() => {
  //   localStorage.removeItem("expensesData");
  //   localStorage.removeItem("trashData");
  //   setData(mockData);
  //   setTrashData([]);
  // }, []);

  // delete button
  const handleDelete = () => {
    Swal.fire({
      title: "Move to Trash?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const rowsToDelete = data.filter((row) => selectedRows.includes(row));

        const existingTrash =
          JSON.parse(localStorage.getItem("trashData")) || [];

        const updatedTrash = [
          ...existingTrash,
          ...rowsToDelete.map((row) => ({
            ...row,
            transactions: getEmployeeTransactions(row.employee),
            deletedAt: new Date().toISOString(),
          })),
        ];

        localStorage.setItem("trashData", JSON.stringify(updatedTrash));
        setTrashData(updatedTrash);

        const updatedData = data.filter((row) => !rowsToDelete.includes(row));

        localStorage.setItem("expensesData", JSON.stringify(updatedData));
        setData(updatedData);

        setSelectedRows([]);

        Swal.fire({
          title: "Deleted!",
          text: "Selected items have been moved to Trash.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    });
  };

  // function to find transactions of an employee
  const getEmployeeTransactions = (employeeName) => {
    return (
      data.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  const handleRowClick = (rowData) => {
    const rowDataById = data.find((row) => row.id === rowData.id);

    if (rowDataById) {
      setLoading(true);
      setTimeout(() => {
        navigate("/approval", { state: rowDataById });
      }, 1000);
    }
  };

  const handleCheckBoxChange = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredData.length ? [] : [...filteredData]
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

    setSelectedRows([]);
  };

  // total status HeaderCount
  const getTotalAmountByStatus = (status) => {
    return data
      .filter((row) => row.status === status)
      .reduce((sum, row) => {
        const transactions = getEmployeeTransactions(row.employee);
        const grandTotal = transactions.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );
        return sum + grandTotal;
      }, 0);
  };

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
        handleDelete={handleDelete}
      />

      <div>
        <div className="card-header text-center">
          <HeaderCount
            pendingTotal={getTotalAmountByStatus("Pending")}
            approvedTotal={getTotalAmountByStatus("Approved")}
            postTotal={getTotalAmountByStatus("Post")}
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
              checked={selectedRows.length === data.length && data.length > 0}
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

// data
const ExpenseRow = ({
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

export default Expenses;
