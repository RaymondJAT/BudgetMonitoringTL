import { Container } from "react-bootstrap";

const Total = ({ data }) => {
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

  // Calculate totals
  const totals = {
    pending: 0,
    approved: 0,
    inPayment: 0,
  };

  data.forEach((item) => {
    const key = mapStatusesToKeys[item.status];
    const amount = isNaN(item.total) ? 0 : Number(item.total);

    if (key === "pending" || key === "approved") {
      if (item.paidBy === "Employee") {
        totals[key] += amount;
      }
    } else if (key === "inPayment") {
      totals.inPayment += amount;
    }
  });

  // Ensure no negative values
  Object.keys(totals).forEach((key) => {
    if (totals[key] < 0) totals[key] = 0;
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
