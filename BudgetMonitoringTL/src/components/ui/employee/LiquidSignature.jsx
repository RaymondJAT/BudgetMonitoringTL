import { Row, Col, FloatingLabel, Form } from "react-bootstrap";

const LiquidSignature = ({
  signatures,
  setSignatures,
  handleSignatureUpload,
}) => {
  return (
    <div
      className="request-container border p-3 mt-3"
      style={{ borderRadius: "6px" }}
    >
      <p className="mb-3 fw-bold">Upload Signature</p>
      <Row className="g-2">
        <Col xs={12} md={3}>
          <FloatingLabel
            controlId="preparedBy"
            label="Prepared by (Printed Name)"
            className="mb-2"
          >
            <Form.Control
              type="text"
              placeholder="Prepared by"
              className="form-control-sm small-input"
              value={signatures.preparedBy || ""}
              onChange={(e) =>
                setSignatures((prev) => ({
                  ...prev,
                  preparedBy: e.target.value,
                }))
              }
            />
          </FloatingLabel>
        </Col>

        <Col xs={12} md={3}>
          <label className="form-label fw-bold">Signature:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSignatureUpload(e, "preparedSignature")}
            className="form-control form-control-sm small-input"
          />
        </Col>

        {signatures.preparedSignature && (
          <Col xs={12} md={3} className="d-flex align-items-end">
            <img
              src={signatures.preparedSignature}
              alt="Prepared Signature"
              style={{ maxHeight: "60px" }}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default LiquidSignature;
