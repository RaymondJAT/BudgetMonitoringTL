import { Row, Col } from "react-bootstrap";
import { normalizeBase64Image } from "../utils/signature";

const SignatureBlock = ({ label, signature, name }) => (
  <Col xs={12} md={4} className="text-center">
    <div
      className="text-center d-flex flex-column justify-content-center align-items-center"
      style={{ height: "120px", position: "relative" }}
    >
      {/* Signature */}
      {signature && (
        <img
          src={normalizeBase64Image(signature)}
          alt={`${label} Signature`}
          style={{
            height: "70px",
            marginBottom: "-25px",
            opacity: 0.9,
            zIndex: 1,
          }}
        />
      )}

      {/* Printed Name + Line */}
      <div className="text-center" style={{ marginBottom: "4px", zIndex: 2 }}>
        <div
          style={{
            borderTop: "1px solid #000",
            width: "210px",
            margin: "0 auto",
          }}
        ></div>
        <div style={{ fontWeight: "bold", marginTop: "4px" }}>{name || ""}</div>
      </div>

      {/* Label (below printed name) */}
      <p className="mb-0 small text-muted">
        <strong>{label}</strong>
      </p>
    </div>
  </Col>
);

const SignatureViewer = ({ signatures }) => {
  return (
    <div className="request-container">
      <Row className="signature mt-0 small">
        <SignatureBlock
          label="Requested by"
          signature={signatures?.requestSignature}
          name={signatures?.requestedName}
        />
        <SignatureBlock
          label="Approved by"
          signature={signatures?.approved}
          name={signatures?.approvedName}
        />
        <SignatureBlock
          label="Received by"
          signature={signatures?.financeApproved}
          name={signatures?.financeName}
        />
      </Row>
    </div>
  );
};

export default SignatureViewer;
