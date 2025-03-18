import React, { useState, useRef } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";
import Header from "../components/Header";
import loader from "../assets/5Lloading.gif";
import Sidebar from "../components/Sidebar";
import HeaderCount from "../components/HeaderCount";
import ExpenseReport from "../components/Sample";

const TeamLead = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const pendingCount = mockData.filter(
    (row) => row.status === "Pending"
  ).length;
  const approvedCount = mockData.filter(
    (row) => row.status === "Approved"
  ).length;
  const postCount = mockData.filter((row) => row.status === "Post").length;

  const handleRowClick = (rowData) => {
    setLoading(true);
    setTimeout(() => {
      navigate("/approval", { state: rowData });
    }, 1000);
  };

  const handleCheckBoxChange = (row) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(row)
        ? prevSelected.filter((item) => item !== row)
        : [...prevSelected, row]
    );
  };

  // const handleCheckBoxChange = (row) => {
  //   setSelectedRows(
  //     (prevSelected) =>
  //       prevSelected.includes(row)
  //         ? prevSelected.filter((item) => item !== row)
  //         : [row] // Allow only one selected row at a time
  //   );
  // };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === mockData.length ? [] : [...mockData]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((s) => s !== status)
        : [...prevStatuses, status]
    );
  };

  // filter data based on search and status
  const filteredData = mockData
    .filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(
      (row) =>
        selectedStatuses.length === 0 || selectedStatuses.includes(row.status)
    ); // status filtering

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
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            postCount={postCount}
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
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === mockData.length}
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
                      {filteredData.map((row, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(row)}
                          className={`text-center ${
                            selectedRows.includes(row) ? "highlighted-row" : ""
                          }`}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(row)}
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
                          <td className="hidden-column">{row.price}</td>
                          <td className="hidden-column">{row.quantity}</td>
                          <td>₱{row.total}</td>
                          <td>
                            <span
                              className={`status-badge ${row.status.toLowerCase()}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <ExpenseReport data={selectedRows[0] || {}} reportRef={reportRef} />
    </>
  );
};

export default TeamLead;
