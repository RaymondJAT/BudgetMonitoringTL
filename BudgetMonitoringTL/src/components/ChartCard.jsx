import { Card } from "react-bootstrap";

const ChartCard = ({ title, children }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="p-3 d-flex flex-column">
        <h6 className="text-dark mb-2" style={{ fontSize: "0.75rem" }}>
          {title}
        </h6>
        <div className="flex-grow-1" style={{ fontSize: "0.75rem" }}>
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
