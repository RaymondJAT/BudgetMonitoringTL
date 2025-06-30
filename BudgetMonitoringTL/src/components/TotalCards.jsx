import { Container } from "react-bootstrap";

const TotalCards = ({
  data = [],
  list = [],
  totalBudget = 0,
  type = "employee", // "admin" | "employee" | "teamlead"
}) => {
  if (!Array.isArray(data)) return null;

  let totals = {};
  list.forEach(({ key }) => {
    totals[key] = 0;
  });

  let budgetUsed = 0;
  let totalRequest = 0;

  data.forEach((item) => {
    const status = item.status?.toLowerCase().trim();
    const amount = Number(item.total);
    const paidBy = item.paidBy;

    if (isNaN(amount)) return;

    if (type === "admin") {
      if (["approved", "inpayment"].includes(status)) {
        budgetUsed += amount;
      }

      if (["pending", "approved", "rejected"].includes(status)) {
        totalRequest += 1;
      }
    }

    if (type === "employee") {
      if (
        (status === "pending" || status === "approved") &&
        paidBy === "Employee"
      ) {
        totals[status] += amount;
      }
    }

    if (type === "teamlead") {
      const isEmployeePaid = paidBy === "Employee";

      if ((status === "pending" || status === "approved") && isEmployeePaid) {
        totals[status] += amount;
      } else if (status === "inpayment") {
        totals["inPayment"] += amount;
      }
    }
  });

  if (type === "admin") {
    const remainingBudget = Math.max(0, totalBudget - budgetUsed);
    totals = {
      totalBudget,
      budgetUsed,
      remainingBudget,
      totalRequest,
    };
  }

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
      {list.map(({ label, key }) => (
        <div
          className="total-box p-3 rounded shadow-sm text-dark"
          key={key}
          style={{ minWidth: "200px", flex: "1" }}
        >
          <h5 className="mb-1">{label}</h5>
          <p className="fs-5 fw-bold m-0">
            {formatValue(key, totals[key] || 0)}
          </p>
        </div>
      ))}
    </Container>
  );
};

export default TotalCards;
