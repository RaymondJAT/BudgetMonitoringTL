import { Container } from "react-bootstrap";
import { useTotalData } from "../hooks/useTotalData";

const Total = () => {
  const { data } = useTotalData();

  const statusList = [
    { label: "To Approve", key: "pending" },
    { label: "For Reimbursement", key: "approved" },
    { label: "In Payment", key: "inPayment" },
  ];

  const mapStatusesToKeys = {
    pending: "pending",
    approved: "approved",
    "in payment": "inPayment",
  };

  const totals = { pending: 0, approved: 0, inPayment: 0 };

  data.forEach((item) => {
    if (!item.status) return;

    const normalizedStatus = item.status.toLowerCase().trim();
    const key = mapStatusesToKeys[normalizedStatus];
    if (!key) return;

    const amount = Number(item.total);
    if (isNaN(amount)) return;

    if (
      (key === "pending" || key === "approved") &&
      item.paidBy === "Employee"
    ) {
      totals[key] += amount;
    } else if (key === "inPayment") {
      totals.inPayment += amount;
    }
  });

  Object.keys(totals).forEach((key) => {
    if (totals[key] < 0) totals[key] = 0;
  });

  return (
    <Container fluid className="total-container mt-3">
      {statusList.map(({ label, key }) => (
        <div className="total-box" key={key}>
          <h5>{label}</h5>
          <p>
            ₱{" "}
            {totals[key].toLocaleString("en-PH", {
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
