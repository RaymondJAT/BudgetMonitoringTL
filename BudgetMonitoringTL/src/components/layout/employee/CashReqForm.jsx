import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Form, FloatingLabel } from "react-bootstrap";
import { numberToWords } from "../../../utils/numberToWords";
import { cashReqFields } from "../../../handlers/columnHeaders";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "../../ui/AppButton";
import RequestForm from "../../ui/employee/RequestForm";
import CashReqTable from "./CashReqTable";

const CashReqForm = ({ data = {}, particulars = [], onChange = () => {} }) => {
  const [formData, setFormData] = useState({
    employee: "",
    expenseDate: "",
    department: "",
    teamLead: "",
    position: "",
    description: "",
    ...data,
  });

  const [signatures, setSignatures] = useState({
    approvedName: "",
    requestSignature: null,
  });

  const [rows, setRows] = useState(
    particulars.length ? particulars : [{ label: "", price: "", quantity: "" }]
  );

  const signatureInputRef = useRef(null);

  const total = rows.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    const quantity = parseFloat(row.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const amountInWords = total ? numberToWords(total) : "Zero Pesos Only";

  useEffect(() => {
    onChange({ ...formData, particulars: rows, total, amountInWords });
  }, [formData, rows, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { label: "", price: "", quantity: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(
      updated.length ? updated : [{ label: "", price: "", quantity: "" }]
    );
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({
          ...prev,
          requestSignature: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    setSignatures((prev) => ({
      ...prev,
      requestSignature: null,
    }));
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
    signatureInputRef.current.click();
  };

  return (
    <Container fluid>
      {/* CASH REQUEST FORM */}
      <RequestForm
        fields={cashReqFields}
        formData={formData}
        onChange={handleInputChange}
        amountInWords={amountInWords}
      />
      {/* CASH REQ TABLE */}
      <CashReqTable
        rows={rows}
        onRowChange={handleRowChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
      />

      <div
        className="request-container border p-3 mt-3"
        style={{ borderRadius: "6px" }}
      >
        <p className="mb-3 fw-bold">Upload Signature</p>
        <Row className="g-2 align-items-center">
          <Col xs={12} md={3}>
            <FloatingLabel
              controlId="approvedName"
              label="Requested by"
              className="mb-2"
            >
              <Form.Control
                type="text"
                placeholder="Requested by"
                className="form-control-sm small-input"
                value={signatures.approvedName}
                onChange={(e) =>
                  setSignatures((prev) => ({
                    ...prev,
                    approvedName: e.target.value,
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
                  onChange={handleSignatureUpload}
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

          {signatures.requestSignature && (
            <Col
              xs={12}
              md={3}
              className="d-flex align-items-center"
              style={{ marginLeft: "-170px" }}
            >
              <div className="position-relative">
                <img
                  src={signatures.requestSignature}
                  alt="Requested Signature"
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
    </Container>
  );
};

export default CashReqForm;
