import React, { useState } from "react";
import Header from "../components/Header";
import HeaderCount from "../components/HeaderCount";
import Sidebar from "../components/Sidebar";
import ImportantTable from "../components/ImportantTable";
import { Card } from "react-bootstrap";

const Important = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <>
      <Header />
      <div className="card-header text-center">
        <HeaderCount />
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
                <ImportantTable />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Important;
