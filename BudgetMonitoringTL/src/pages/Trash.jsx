import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useReactToPrint } from "react-to-print";
import { Card } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TrashTable from "../components/TrashTable";

const Trash = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [trashData, setTrashData] = useState([]);

  // load trash from local storage
  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem("trashData")) || [];
    setTrashData(storedTrash);
  }, []);

  const handleDelete = () => {
    Swal.fire({
      title: "Permanently delete selected items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTrash = trashData.filter(
          (row) => !selectedRows.includes(row)
        );

        localStorage.setItem("trashData", JSON.stringify(updatedTrash));
        setTrashData(updatedTrash);
        setSelectedRows([]);

        Swal.fire(
          "Deleted!",
          "Selected items have been permanently removed.",
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
                <h2>Trash</h2>
                <TrashTable
                  data={trashData}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
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
