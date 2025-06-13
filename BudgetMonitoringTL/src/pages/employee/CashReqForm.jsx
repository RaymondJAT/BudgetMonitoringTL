import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";

const numberToWords = (num) => {
  if (num === 0) return "Zero Pesos Only";
  return (
    num.toLocaleString("en-US", { style: "currency", currency: "PHP" }) +
    " Only"
  );
};

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

  const total = particulars.reduce(
    (sum, row) => sum + (row.quantity ?? 0) * (row.price ?? 0),
    0
  );

  const amountInWords = total ? numberToWords(total) : "Zero Pesos Only";

  useEffect(() => {
    onChange({ ...formData, total, amountInWords });
  }, [formData, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    { label: "Employee", key: "employee" },
    { label: "Expense Date", key: "expenseDate", type: "date" },
    { label: "Department", key: "department" },
    { label: "Team Lead", key: "teamLead" },
    { label: "Position", key: "position" },
  ];

  return (
    <Container fluid>
      <div className="custom-container border p-3 bg-white">
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
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {fields.map(({ label, key, type = "text" }) => (
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

      <Table responsive className="custom-table mt-3">
        <thead className="tableHead text-center">
          <tr>
            <th>Label</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody className="tableBody text-center">
          {particulars.map((row, index) => (
            <tr key={index}>
              <td>{row.label || "N/A"}</td>
              <td>
                ₱
                {(row.price ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>{row.quantity ?? 0}</td>
              <td>
                ₱
                {((row.quantity ?? 0) * (row.price ?? 0)).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2 }
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end border-end">
              <strong>Total:</strong>
            </td>
            <td className="text-center border-end">
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
    </Container>
  );
};

export default CashReqForm;
