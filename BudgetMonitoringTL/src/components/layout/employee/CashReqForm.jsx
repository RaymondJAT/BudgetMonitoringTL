import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { numberToWords } from "../../../utils/numberToWords";
import { cashReqFields } from "../../../handlers/columnHeaders";
import AppButton from "../../ui/AppButton";
import RequestForm from "../../ui/employee/RequestForm";

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
    approvedSignature: null,
  });

  const [rows, setRows] = useState(
    particulars.length ? particulars : [{ label: "", price: "", quantity: "" }]
  );

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    if (field === "price" || field === "quantity") {
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
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

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({
          ...prev,
          [`${type}Signature`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container fluid>
      <RequestForm
        fields={cashReqFields}
        formData={formData}
        onChange={handleInputChange}
        amountInWords={amountInWords}
      />

      <div className="request-table-wrapper">
        <Table className="request-table">
          <thead className="tableHead text-center">
            <tr>
              <th>Label</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="tableBody text-center">
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={row.label}
                    onChange={(e) =>
                      handleRowChange(index, "label", e.target.value)
                    }
                    size="sm"
                    className="small-input"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={row.price}
                    onChange={(e) =>
                      handleRowChange(index, "price", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        ["e", "E", "+", "-"].includes(e.key) ||
                        (e.ctrlKey && e.key === "v")
                      ) {
                        e.preventDefault();
                      }
                    }}
                    size="sm"
                    className="small-input"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        ["e", "E", "+", "-"].includes(e.key) ||
                        (e.ctrlKey && e.key === "v")
                      ) {
                        e.preventDefault();
                      }
                    }}
                    size="sm"
                    className="small-input"
                  />
                </td>
                <td>
                  ₱
                  {(
                    parseFloat(row.quantity || 0) * parseFloat(row.price || 0)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <AppButton
                    label="Remove"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveRow(index)}
                    className="custom-app-button text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end">
                <strong>Total:</strong>
              </td>
              <td className="text-center">
                <strong>
                  ₱
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
              <td />
            </tr>
          </tfoot>
        </Table>

        <div className="text-center mb-3">
          <AppButton
            label="+"
            onClick={handleAddRow}
            variant="outline-dark"
            size="sm"
            className="add-circle-btn"
          />
        </div>
      </div>

      <div
        className="request-container border p-3 mt-3"
        style={{ borderRadius: "6px" }}
      >
        <p className="mb-3 fw-bold">Upload Signature</p>
        <Row className="g-2">
          <Col xs={12} md={3}>
            <FloatingLabel
              controlId="approvedName"
              label="Requested by (Printed Name)"
              className="mb-2"
            >
              <Form.Control
                type="text"
                placeholder="Requested by (Printed Name)"
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
            <label className="form-label">Signature:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSignatureUpload(e, "approved")}
              className="form-control form-control-sm small-input"
            />
          </Col>

          {signatures.approvedSignature && (
            <Col xs={12} md={3} className="d-flex align-items-end">
              <img
                src={signatures.approvedSignature}
                alt="Approved Signature"
                style={{ maxHeight: "60px" }}
              />
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default CashReqForm;
