import { useRef } from "react";
import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "./ui/AppButton";
import { normalizeBase64Image } from "../utils/signature";

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

  // Compress the image using a canvas before converting to Base64
  const compressImage = (
    file,
    maxWidth = 500,
    maxHeight = 200,
    quality = 0.7
  ) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1
          );
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png", quality));
        };
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const compressedBase64 = await compressImage(file);
      setSignatures((prev) => ({
        ...prev,
        [signatureKey]: normalizeBase64Image(compressedBase64), // ✅ normalize here
      }));
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
          {readOnly ? (
            <Col xs={12} md={6} className="d-flex align-items-center gap-3">
              <div>
                <strong>{label}:</strong>
                <p className="mb-0 mt-1">{signatures[nameKey] || "N/A"}</p>
              </div>
              {signatures[signatureKey] ? (
                <img
                  src={normalizeBase64Image(signatures[signatureKey])} // ✅ normalize before render
                  alt="Signature"
                  style={{ maxHeight: "50px", padding: "2px" }}
                />
              ) : (
                <p className="text-muted mb-0">No signature uploaded.</p>
              )}
            </Col>
          ) : (
            <>
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
                      {console.log(
                        "Signature value in SignatureUpload:",
                        signatures[signatureKey]
                      )}
                      <img
                        src={normalizeBase64Image(signatures[signatureKey])}
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
                        onClick={handleRemoveSignature}
                        title="Remove Signature"
                      />
                    </div>
                  )}
                </div>
              </Col>
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default SignatureUpload;
