import React, { useState } from "react";
import { Table, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";

const TeamLead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRowClick = (rowData) => {
    setLoading(true);

    setTimeout(() => {
      navigate("/approval", { state: rowData });
    }, 800);
  };

  return (
    <>
      {loading && (
        <div className="loading">
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      {/* Main Table Content */}
      <Card className="w-auto">
        <Card.Header as="h5" className="text-center">
          <div className="approval-steps">
            <span className="step">To Approve</span>
            <span className="separator"> &gt; </span>
            <span className="step">Waiting Reimbursement</span>
            <span className="separator"> &gt; </span>
            <span className="step">In Payment</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover className="team-table m-0">
            <thead>
              <tr className="text-center">
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
              {mockData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  style={{ cursor: "pointer" }}
                  className="text-center"
                >
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
        </Card.Body>
      </Card>
    </>
  );
};

export default TeamLead;
