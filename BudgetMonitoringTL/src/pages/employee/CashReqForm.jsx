import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { numberToWords } from "../../utils/numberToWords";
import { cashReqFields } from "../../handlers/columnHeaders";
import AppButton from "../../components/ui/AppButton";

const CashReqForm = ({
  data = {},
  signatures = {},
  particulars = [],
  onChange = () => {},
}) => {
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
      <div className="custom-container border p-3 bg-white mb-3">
        <Row className="mb-2">
          <Col xs={12}>
            <Form.Group controlId="description">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                size="sm"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {cashReqFields.map(({ label, key, type = "text" }) => (
            <Col xs={12} md={6} className="mb-2" key={key}>
              <Form.Group controlId={key}>
                <Form.Label>
                  <strong>{label}</strong>
                </Form.Label>
                <Form.Control
                  type={type}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  size="sm"
                />
              </Form.Group>
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

      <div
        className="table-scroll-wrapper mt-3"
        style={{
          maxHeight: rows.length >= 2 ? "180px" : "unset",
          overflowY: rows.length >= 2 ? "auto" : "unset",
        }}
      >
        <Table hover className="expense-table mt-3">
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
              <td colSpan="4" className="text-end">
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
            </tr>
          </tfoot>
        </Table>
      </div>

      <div className="text-end mt-3 ">
        <AppButton
          label="+ Add
        Row"
          onClick={handleAddRow}
          variant="success"
          size="sm"
          className="custom-app-button"
        />
      </div>
    </Container>
  );
};

export default CashReqForm;
