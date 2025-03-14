import React, { useState } from "react";
import { Table, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";
import Header from "../components/Header";
import loader from "../assets/5Lloading.gif";

const TeamLead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // header count
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

  // individual row
  const handleCheckBoxChange = (row) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(row)
        ? prevSelected.filter((item) => item !== row)
        : [...prevSelected, row]
    );
  };

  // all rows
  const handleSelectAll = () => {
    if (selectedRows.length === mockData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...mockData]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredData = mockData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      {loading && (
        <div className="loading">
          {/* <Spinner animation="border" variant="danger" /> */}
          <img src={loader} alt="Loading GIF" className="custom-loader" />
        </div>
      )}

      <Header
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handlePrint={handlePrint}
      />

      {/* Main Table Content */}
      <Card className="w-auto">
        <Card.Header as="h5" className="text-center">
          <div className="approval-steps">
            <div className="step">
              <div className="count">{pendingCount}</div>
              <span>To Approve</span>
            </div>
            <div className="step">
              <div className="count">{approvedCount}</div>
              <span>Waiting Reimbursement</span>
            </div>
            <div className="step">
              <div className="count">{postCount}</div>
              <span>In Payment</span>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="team-table m-0">
              <thead>
                <tr className="text-center">
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
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: "pointer" }}
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
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default TeamLead;
