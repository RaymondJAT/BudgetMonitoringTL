import React, { useState } from "react";
import { Table, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";

const TeamLead = () => {
  const navigate = useNavigate();

  const handleRowClick = (rowData) => {
    navigate("/approval", { state: rowData });
  };

  return (
    <Card className="w-auto">
      <Card.Header as="h5" className="text-center">
        TEAM LEADER
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
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TeamLead;
