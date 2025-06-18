import { useRef } from "react";
import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "../AppButton";

const LiquidSignature = ({
  signatures,
  setSignatures,
  handleSignatureUpload,
}) => {
  const signatureInputRef = useRef(null);

  const handleButtonClick = () => {
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
    signatureInputRef.current.click();
  };

  const handleRemoveSignature = () => {
    setSignatures((prev) => ({
      ...prev,
      preparedSignature: null,
    }));

    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
  };

  return (
    <div
      className="request-container border p-3 mt-3"
      style={{ borderRadius: "6px" }}
    >
      <p className="mb-3 fw-bold">Upload Signature</p>
      <Row className="g-2 align-items-center">
        <Col xs={12} md={3}>
          <FloatingLabel
            controlId="preparedBy"
            label="Prepared by"
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
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, "preparedSignature")}
                className="d-none"
                ref={signatureInputRef}
              />
              <AppButton
                label="Choose File"
                variant="outline-dark"
                onClick={handleButtonClick}
                className="custom-app-button"
              />
            </div>
          </div>
        </Col>

        {signatures.preparedSignature && (
          <Col
            xs={12}
            md={3}
            className="d-flex align-items-center"
            style={{ marginLeft: "-170px" }}
          >
            <div className="position-relative">
              <img
                src={signatures.preparedSignature}
                alt="Prepared Signature"
                style={{
                  maxHeight: "50px",

                  padding: "2px",
                }}
              />
              <IoIosRemoveCircleOutline
                size={20}
                className="position-absolute top-0 end-0"
                style={{
                  cursor: "pointer",
                  color: "red",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transform: "translate(80%, -70%)",
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#36454F";
                  e.currentTarget.style.transform =
                    "translate(80%, -70%) scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "red";
                  e.currentTarget.style.transform = "translate(80%, -70%)";
                  e.currentTarget.style.boxShadow = "0 0 3px rgba(0,0,0,0.3)";
                }}
                onClick={handleRemoveSignature}
                title="Remove Signature"
              />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default LiquidSignature;
