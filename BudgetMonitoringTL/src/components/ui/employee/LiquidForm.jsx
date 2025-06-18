import { useState } from "react";
import { Row, Col, FloatingLabel, Form } from "react-bootstrap";
import LiquidTable from "../../layout/employee/LiquidTable";
import LiquidReceipt from "./LiquidReceipt";
import LiquidSignature from "./LiquidSignature";

const LiquidForm = ({ formData = {}, onChange = () => {} }) => {
  const preventInvalidKeys = (e, type) => {
    if (
      type === "number" &&
      (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v"))
    ) {
      e.preventDefault();
    }
  };

  const [signatures, setSignatures] = useState({
    preparedBy: "",
    preparedSignature: "",
  });

  const handleNumberInput = (e, type) => {
    if (type === "number") {
      const value = e.target.value;
      if (parseFloat(value) < 0) {
        e.target.value = "0";
      }
    }
    onChange(e);
  };

  const handleSignatureUpload = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({
          ...prev,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* FORM SECTION */}
      <div className="request-container border p-3 mb-2">
        <Row>
          <Col md={6}>
            <FloatingLabel
              controlId="employee"
              label="Employee"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="employee"
                value={formData.employee || ""}
                onChange={onChange}
                placeholder="Employee"
                className="form-control-sm small-input"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="department"
              label="Department"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={onChange}
                placeholder="Department"
                className="form-control-sm small-input"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="date"
              label="Date of Liquidation"
              className="mb-2"
            >
              <Form.Control
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={onChange}
                placeholder="Date of Liquidation"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>

          <Col md={6}>
            <FloatingLabel
              controlId="amountObtained"
              label="Amount Obtained"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="amountObtained"
                value={formData.amountObtained || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Amount Obtained"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="amountExpended"
              label="Amount Expended"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="amountExpended"
                value={formData.amountExpended || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Amount Expended"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="reimburseOrReturn"
              label="Reimburse / Return"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="reimburseOrReturn"
                value={formData.reimburseOrReturn || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Reimburse / Return"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>
          </Col>
        </Row>
      </div>
      {/* TABLE SECTION */}
      <LiquidTable />
      {/* UPLOAD RECEIPT */}
      <LiquidReceipt />
      {/* SIGNATURE */}
      <LiquidSignature
        signatures={signatures}
        setSignatures={setSignatures}
        handleSignatureUpload={handleSignatureUpload}
      />
    </>
  );
};

export default LiquidForm;
