import { Container } from "react-bootstrap";

const TotalCards = ({
  data = [],
  list = [],
  totalBudget = 0,
  type = "employee",
  size = "md",
}) => {
  if (!Array.isArray(data)) return null;

  let totals = {};
  list.forEach(({ key }) => {
    totals[key] = 0;
  });

  let budgetUsed = 0;
  let totalRequest = 0;

  data.forEach((item) => {
    if (!item || typeof item !== "object") return;

    if (type === "admin") {
      const status = item.status?.toLowerCase().trim();
      const amount = Number(item.total);
      if (isNaN(amount)) return;

      if (["approved", "inpayment"].includes(status)) {
        budgetUsed += amount;
      }

      if (["pending", "approved", "rejected"].includes(status)) {
        totalRequest += 1;
      }
    }

    if (type === "employee") {
      const status = item.status?.toLowerCase().trim();
      const amount = Number(item.total);
      const paidBy = item.paidBy;

      if (isNaN(amount)) return;

      if (
        (status === "pending" || status === "approved") &&
        paidBy === "Employee"
      ) {
        totals[status] += amount;
      }
    }

    if (type === "teamlead") {
      const status = item.status?.toLowerCase().trim();
      const amount = Number(item.total);
      const paidBy = item.paidBy;
      const isEmployeePaid = paidBy === "Employee";

      if (isNaN(amount)) return;

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

  if (type === "view") {
    const item = data[0] || {};
    totals = {
      totalBudget: item.totalBudget || 0,
      budgetUsed: item.budgetUsed || 0,
      remainingBudget: item.remainingBudget || 0,
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

  const sizeStyles = {
    sm: {
      box: "p-2",
      label: "fs-6",
      value: "fs-6",
    },
    md: {
      box: "p-3",
      label: "fs-5",
      value: "fs-5 fw-bold",
    },
    lg: {
      box: "p-4",
      label: "fs-4",
      value: "fs-3 fw-bold",
    },
  };

  const currentStyle = sizeStyles[size] || sizeStyles.md;
  return (
    <Container fluid className="total-container mb-3">
      {list.map(({ label, key }) => (
        <div
          className={`total-box ${currentStyle.box} rounded shadow-sm text-dark`}
          key={key}
        >
          <h5 className={`${currentStyle.label} mb-1`}>{label}</h5>
          <p className={`${currentStyle.value} m-0`}>
            {formatValue(key, totals[key] || 0)}
          </p>
        </div>
      ))}
    </Container>
  );
};

export default TotalCards;
