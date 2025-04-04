import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useReactToPrint } from "react-to-print";
import { Card } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TrashTable from "../components/TrashTable";
import HeaderCount from "../components/HeaderCount";
import { mockData } from "../mock-data/mockData";
import loader from "../assets/5Lloading.gif";
import Swal from "sweetalert2";

const Trash = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const storedExpenses =
      JSON.parse(localStorage.getItem("expensesData")) || [];
    setExpensesData(storedExpenses);
  }, []);

  // load trash from local storage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("trashData"));
    setTrashData(storedData || []);
  }, []);

  //   delete button
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTrash = trashData.filter(
          (row) => !selectedRows.includes(row.id)
        );

        localStorage.setItem("trashData", JSON.stringify(updatedTrash));
        setTrashData(updatedTrash);

        setSelectedRows([]);

        Swal.fire({
          title: "Deleted!",
          text: "Selected items have been permanently removed.",
          icon: "success",
        });
      }
    });
  };

  // react-to-print
  const handlePrint = () => {
    reactToPrintFn();
  };

  const handleRowClick = (rowData) => {
    setLoading(true);
    setTimeout(() => Navigate("/approval", { state: rowData }), 1000);
  };

  const handleCheckBoxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows((prevSelected) =>
      prevSelected.length === trashData.length
        ? []
        : trashData.map((row) => row.id)
    );
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getEmployeeTransactions = (employeeName) => {
    return (
      mockData.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  // HeaderCount status
  const getTotalAmountByStatus = (status) => {
    return expensesData
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
                <TrashTable
                  data={trashData}
                  selectedRows={selectedRows}
                  handleRowClick={handleRowClick}
                  handleCheckBoxChange={handleCheckBoxChange}
                  handleSelectAll={handleSelectAll}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Trash;
