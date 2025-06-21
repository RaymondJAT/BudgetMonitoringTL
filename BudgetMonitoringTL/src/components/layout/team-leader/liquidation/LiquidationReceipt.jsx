import { Row, Col } from "react-bootstrap";

const LiquidationReceipt = ({ images = [] }) => {
  return (
    <div className="custom-container border mb-3 p-3 bg-white rounded">
      <p className="fw-bold mb-3">Proof of Liquidation</p>

      {images.length > 0 ? (
        <Row className="g-3">
          {images.map((src, index) => (
            <Col xs={12} md={6} lg={4} key={index}>
              <div className="border rounded overflow-hidden text-center p-2">
                <img
                  src={src}
                  alt={`Proof ${index + 1}`}
                  style={{
                    maxHeight: "250px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted">No receipts provided.</p>
      )}
    </div>
  );
};

export default LiquidationReceipt;
