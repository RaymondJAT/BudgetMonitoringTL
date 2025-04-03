import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useReactToPrint } from "react-to-print";
import { Card } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TrashTable from "../components/TrashTable";
import HeaderCount from "../components/HeaderCount";
import { mockData } from "../mock-data/mockData";
import loader from "../assets/5Lloading.gif";

const Trash = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(mockData);

  // load trash from local storage
  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem("trashData")) || [];
    setTrashData(storedTrash);
  }, []);

  //   delete button with SWAL
  //   const handleDelete = () => {
  //     Swal.fire({
  //       title: "Permanently delete selected items?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Delete",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         const updatedTrash = trashData.filter(
  //           (row) => !selectedRows.includes(row)
  //         );

  //         localStorage.setItem("trashData", JSON.stringify(updatedTrash));
  //         setTrashData(updatedTrash);
  //         setSelectedRows([]);

  //         Swal.fire(
  //           "Deleted!",
  //           "Selected items have been permanently removed.",
  //           "success"
  //         );
  //       }
  //     });
  //   };

  // react-to-print
  const getEmployeeTransactions = (employeeName) => {
    return (
      mockData.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  const handlePrint = () => {
    reactToPrintFn();
  };

  const handleRowClick = (rowData) => {
    const rowDataById = data.find((row) => row.id === rowData.id);

    if (rowDataById) {
      setLoading(true);
      setTimeout(() => {
        Navigate("/approval", { state: rowDataById });
      }, 1000);
    }
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
        // handleDelete={handleDelete}
      />

      <div className="card-header text-center">
        <HeaderCount
          pendingTotal={getTotalAmountByStatus("Pending")}
          approvedTotal={getTotalAmountByStatus("Approved")}
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
