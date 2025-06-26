import { Container } from "react-bootstrap";
import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";

const TotalForEmployee = ({ data }) => {
  const totals = { pending: 0, approved: 0 };

  if (!Array.isArray(data)) return null;

  data.forEach((item) => {
    if (!item.status || item.status === "Deleted") return;
    const status = item.status.toLowerCase().trim();
    const amount = Number(item.total);
    if (isNaN(amount)) return;

    if (
      (status === "pending" || status === "approved") &&
      item.paidBy === "Employee"
    ) {
      totals[status] += amount;
    }
  });

  return (
    <Container fluid className="total-container mt-3 d-flex flex-wrap gap-3">
      {EMPLOYEE_STATUS_LIST.map(({ label, key }) => (
        <div
          className="total-box p-3 rounded shadow-sm bg-light text-dark"
          key={key}
          style={{ minWidth: "200px", flex: "1" }}
        >
          <h5 className="mb-1">{label}</h5>
          <p className="fs-5 fw-bold m-0">
            ₱
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

export default TotalForEmployee;
