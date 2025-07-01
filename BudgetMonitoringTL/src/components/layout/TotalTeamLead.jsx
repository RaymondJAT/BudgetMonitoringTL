import { Container } from "react-bootstrap";
import { mapStatusesToKeys } from "../../constants/mapStatus";

const Total = ({ data, statusList = defaultStatusList }) => {
  const totals = { pending: 0, approved: 0, inPayment: 0 };

  if (!data || !Array.isArray(data)) {
    return null;
  }
 
  data.forEach((item) => {
    if (!item.status || item.status === "Deleted") return;
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
