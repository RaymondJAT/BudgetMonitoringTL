import { Container } from "react-bootstrap";

const TotalCards = ({ data = [], size = "md" }) => {
  if (!Array.isArray(data)) return null;

  const formatPeso = (value) => {
    const num = Number(value) || 0;
    return `₱ ${num.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString("en-PH");
  };

  const sizeStyles = {
    sm: { box: "p-1", label: "fs-6", value: "fs-6" },
    md: { box: "p-2", label: "fs-5", value: "fs-5 fw-bold" },
    lg: { box: "p-4", label: "fs-4", value: "fs-3 fw-bold" },
  };

  const currentStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <Container fluid className="total-container mb-3 d-flex flex-wrap gap-2">
      {data.map(({ label, key, value, subValue }) => {
        let displayValue;

        if (subValue !== undefined) {
          displayValue = formatNumber(value);
        } else if (key === "pending_requests") {
          displayValue = formatNumber(value);
        } else {
          displayValue = formatPeso(value);
        }

        return (
          <div
            className={`total-box ${currentStyle.box} rounded shadow-sm text-dark flex-fill`}
            key={key}
          >
            <h5 className={`${currentStyle.label} mb-1`}>{label}</h5>
            <p className={`${currentStyle.value} m-0`}>{displayValue}</p>

            {subValue !== undefined && (
              <small className="text-muted">
                Total: {formatPeso(subValue)}
              </small>
            )}
          </div>
        );
      })}
    </Container>
  );
};

export default TotalCards;
