import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { numberToWords } from "../../utils/numberToWords";
import { cashReqFields } from "../../handlers/columnHeaders";
import AppButton from "../../components/ui/AppButton";

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

  return (
    <Container fluid>
      <div className="request-container border p-3 bg-white">
        <Row className="mb-2">
          <Col xs={12}>
            <FloatingLabel
              controlId="description"
              label="Description"
              className="mb-2"
            >
              <Form.Control
                as="textarea"
                rows={1}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row className="mb-2">
          {["employee", "department", "position"].map((key) => {
            const { label, type = "text" } = cashReqFields.find(
              (f) => f.key === key
            );
            return (
              <Col xs={12} md={4} key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-2">
                  <Form.Control
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder={label}
                    className="form-control-sm small-input"
                  />
                </FloatingLabel>
              </Col>
            );
          })}
        </Row>

        <Row>
          {cashReqFields
            .filter(
              ({ key }) => !["employee", "department", "position"].includes(key)
            )
            .map(({ label, key, type = "text" }) => (
              <Col xs={12} md={6} className="mb-2" key={key}>
                <FloatingLabel controlId={key} label={label} className="mb-2">
                  <Form.Control
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder={label}
                    className="form-control-sm small-input"
                  />
                </FloatingLabel>
              </Col>
            ))}
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <strong>Amount in Words:</strong>
            <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
          </Col>
        </Row>
      </div>

      <div className="request-table-wrapper">
        <Table hover className="request-table">
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
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveRow(index)}
                    className="custom-app-button"
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
            variant="outline-success"
            size="sm"
            className="add-circle-btn"
          />
        </div>
      </div>
    </Container>
  );
};

export default CashReqForm;
