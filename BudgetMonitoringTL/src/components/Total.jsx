import React from "react";
import { Container } from "react-bootstrap";
import { mockData } from "../mock-data/mockData";

const Total = () => {
  const statusList = [
    { label: "To Approve", key: "pending" },
    { label: "For Reimbursement", key: "approved" },
    { label: "In Payment", key: "inPayment" },
  ];

  const mapStatusesToKeys = {
    Pending: "pending",
    Approved: "approved",
    "In Payment": "inPayment",
  };

  // total
  const totals = {
    pending: 0,
    approved: 0,
    inPayment: 0,
  };

  // total per status
  mockData.forEach((item) => {
    const key = mapStatusesToKeys[item.status];
    if (key && !isNaN(item.total)) {
      totals[key] += Number(item.total);
    }
  });

  return (
    <Container fluid className="total-container mt-3">
      {statusList.map((status) => (
        <div className="total-box" key={status.key}>
          <h5>{status.label}</h5>
          <p>
            ₱{" "}
            {totals[status.key].toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ))}
    </Container>
  );
};

export default Total;
