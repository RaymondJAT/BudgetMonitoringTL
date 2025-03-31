import React, { useState, useRef } from "react";
import Header from "../components/Header";
import { useReactToPrint } from "react-to-print";
import { Card } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const Trash = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

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
          prevData.filter(
            (row) => row.status !== "Approved" || !selectedRows.includes(row)
          )
        );
        setSelectedRows([]);
        Swal.fire(
          "Deleted!",
          "Selected approved items have been deleted.",
          "success"
        );
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

  return (
    <>
      <Header
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handlePrint={handlePrint}
        handleDelete={handleDelete}
      />

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
                <h1>Trash</h1>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Trash;
