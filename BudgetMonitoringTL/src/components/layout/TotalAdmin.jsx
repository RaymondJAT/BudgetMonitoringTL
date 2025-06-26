import { Container } from "react-bootstrap";
import { BudgetOverview } from "../../constants/totalList";

const TotalForAdmin = ({ data = [], totalBudget = 0 }) => {
  let budgetUsed = 0;
  let totalRequest = 0;

  if (!Array.isArray(data)) return null;

  data.forEach((item) => {
    const status = item.status?.toLowerCase().trim();

    if (["approved", "inpayment"].includes(status)) {
      const amount = Number(item.total);
      if (!isNaN(amount)) {
        budgetUsed += amount;
      }
    }

    if (["pending", "approved", "rejected"].includes(status)) {
      totalRequest += 1;
    }
  });

  const remainingBudget = Math.max(0, totalBudget - budgetUsed);

  const budgetData = {
    totalBudget,
    budgetUsed,
    remainingBudget,
    totalRequest,
  };

  const formatValue = (key, value) => {
    if (key === "totalRequest") {
      return value.toLocaleString("en-PH");
    }
    return `₱ ${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Container fluid className="total-container mt-3 d-flex flex-wrap gap-3">
      {BudgetOverview.map(({ label, key }) => (
        <div
          className="total-box p-3 rounded shadow-sm text-dark"
          key={key}
          style={{ minWidth: "200px", flex: "1" }}
        >
          <h5 className="mb-1">{label}</h5>
          <p className="fs-5 fw-bold m-0">
            {formatValue(key, budgetData[key] || 0)}
          </p>
        </div>
      ))}
    </Container>
  );
};

export default TotalForAdmin;
