import { Row, Col, Container, Table, Image } from "react-bootstrap";
import logo from "../../assets/logo5L.png";

const ExpenseReport = ({ data, contentRef }) => {
  const particulars =
    data?.items?.length > 0
      ? data.items.map((item) => ({
          label: item.label || " ",
          price: parseFloat(item.price) || 0,
          quantity: parseFloat(item.quantity) || 0,
          amount:
            (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0),
        }))
      : data?.transactions?.length > 0
      ? data.transactions.map((item) => ({
          label: item.label || " ",
          price: parseFloat(item.price) || 0,
          quantity: parseFloat(item.quantity) || 0,
          amount:
            (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0),
        }))
      : [
          {
            label: data?.label || " ",
            price: parseFloat(data?.unitPrice) || 0,
            quantity: parseFloat(data?.quantity) || 0,
            amount:
              (parseFloat(data?.unitPrice) || 0) *
              (parseFloat(data?.quantity) || 0),
          },
        ];

  const totalAmount = particulars.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <div ref={contentRef}>
      <Container fluid className="px-0 mt-4" style={{ maxWidth: "90%" }}>
        {/* Header */}
        <Row className="border-bottom pb-3 mb-4 align-items-center">
          <Col xs={6}>
            <h4 className="m-0">Expense Report</h4>
          </Col>
          <Col xs={6} className="text-end">
            <Image src={logo} alt="Company Logo" width={100} height="auto" />
          </Col>
        </Row>

        {/* Employee Details */}
        <Row className="mb-4">
          <Col xs={6} className="mb-2">
            <p>
              <strong>Employee:</strong> {data?.employee || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Team Leader:</strong> {data?.teamLead || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Date:</strong> {data?.expenseDate || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Paid By:</strong> {data?.paidBy || " "}
            </p>
          </Col>
        </Row>

        {/* Reference */}
        <Row className="reference-section mb-4">
          <Col>
            <p>
              <strong>Reference:</strong> {data?.description || " "}
            </p>
          </Col>
        </Row>

        {/* Expense Table */}
        <Table className="expense-table">
          <thead className="border-top">
            <tr>
              <th className="text-center">Label</th>
              <th className="text-center">Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {particulars.length > 0 ? (
              particulars.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item.label}</td>
                  <td className="text-center">
                    ₱
                    {(item.price ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center border-start">
                    ₱
                    {item.amount
                      ? parseFloat(item.amount).toLocaleString("es-US", {
                          minimumFractionDigits: 2,
                        })
                      : "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No particulars added.
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="3" className="text-end border-end">
                <strong>Total:</strong>
              </td>
              <td className="text-center">
                <strong>
                  ₱
                  {totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ExpenseReport;
