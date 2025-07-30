import { useRef } from "react";
import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "./ui/AppButton";

const SignatureUpload = ({
  label,
  nameKey,
  signatureKey,
  signatures,
  setSignatures,
  readOnly = false,
}) => {
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({
          ...prev,
          [signatureKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    setSignatures((prev) => ({
      ...prev,
      [signatureKey]: null,
    }));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="signature-upload-container">
      <div
        className="request-container border p-3"
        style={{ borderRadius: "6px" }}
      >
        <p className="mb-3 fw-bold">Upload Signature</p>
        <Row className="g-2 align-items-center">
          {/* read only */}
          {readOnly ? (
            <Col xs={12} md={6} className="d-flex align-items-center gap-3">
              <div>
                <strong>{label}:</strong>
                <p className="mb-0 mt-1">{signatures[nameKey] || "N/A"}</p>
              </div>
              {signatures[signatureKey] ? (
                <img
                  src={signatures[signatureKey]}
                  alt="Signature"
                  style={{ maxHeight: "50px", padding: "2px" }}
                />
              ) : (
                <p className="text-muted mb-0">No signature uploaded.</p>
              )}
            </Col>
          ) : (
            <>
              {/* editable field */}
              <Col xs={12} md={3}>
                <FloatingLabel
                  controlId={nameKey}
                  label={label}
                  className="mb-2"
                >
                  <Form.Control
                    type="text"
                    placeholder={label}
                    className="form-control-sm small-input"
                    value={signatures[nameKey] || ""}
                    onChange={(e) =>
                      setSignatures((prev) => ({
                        ...prev,
                        [nameKey]: e.target.value,
                      }))
                    }
                  />
                </FloatingLabel>
              </Col>

              {/* file upload and signature preview */}
              <Col xs={12} md={6}>
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="d-none"
                    ref={inputRef}
                  />
                  <AppButton
                    label="Choose File"
                    variant="outline-dark"
                    onClick={handleButtonClick}
                    className="custom-app-button"
                  />
                  {signatures[signatureKey] && (
                    <div className="position-relative">
                      <img
                        src={signatures[signatureKey]}
                        alt="Signature"
                        style={{ maxHeight: "50px", padding: "2px" }}
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
                          e.currentTarget.style.boxShadow =
                            "0 0 5px rgba(0,0,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "red";
                          e.currentTarget.style.transform =
                            "translate(80%, -70%)";
                          e.currentTarget.style.boxShadow =
                            "0 0 3px rgba(0,0,0,0.3)";
                        }}
                        onClick={handleRemoveSignature}
                        title="Remove Signature"
                      />
                    </div>
                  )}
                </div>
              </Col>
            </>
          )}

          {/* message for no signature in read-only mode */}
          {readOnly && !signatures[signatureKey] && (
            <Col xs={12}>
              <p className="text-muted">No signature uploaded.</p>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default SignatureUpload;
