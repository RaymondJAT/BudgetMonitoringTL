import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

const PrintableCashRequest = ({ data, amountInWords }) => {
  const particulars = data?.items || [];
  const totalAmount = particulars.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <Container className="p-3">
      <h3 className="text-center fw-bold">CASH REQUEST FORM</h3>
      <Row>
        <Col xs={6}>
          <strong>Name:</strong> {data?.employee || " "}
        </Col>
        <Col xs={6}>
          <strong>Date Filed:</strong> {new Date().toLocaleDateString()}
        </Col>
        <Col xs={6}>
          <strong>Position:</strong> {data?.position || " "}
        </Col>
        <Col xs={6}>
          <strong>Department:</strong> {data?.department || " "}
        </Col>
      </Row>

      <Table bordered className="mt-3">
        <thead>
          <tr>
            <th className="text-center">Particulars</th>
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {particulars.length > 0 ? (
            particulars.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{`${item.label} - ${
                  item.quantity
                } x ${(item.price ?? 0).toFixed(2)}`}</td>
                <td className="text-center">
                  {item.amount ? parseFloat(item.amount).toFixed(2) : "0.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No particulars added.
              </td>
            </tr>
          )}
          <tr>
            <td className="text-end pe-3">
              <strong>Total:</strong>
            </td>
            <td className="text-center">
              <strong>₱{totalAmount.toFixed(2)}</strong>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <strong>Amount in Words:</strong> {amountInWords || "Zero"}
            </td>
          </tr>
        </tbody>
      </Table>

      <Row className="mt-4 text-center">
        <Col xs={4}>
          <strong>Requested by:</strong>{" "}
          <div className="signature-box mt-4"></div>
        </Col>
        <Col xs={4}>
          <strong>Approved by:</strong>{" "}
          <div className="signature-box mt-4"></div>
        </Col>
        <Col xs={4}>
          <strong>Received by:</strong>{" "}
          <div className="signature-box mt-4"></div>
        </Col>
      </Row>
    </Container>
  );
};

export default PrintableCashRequest;
