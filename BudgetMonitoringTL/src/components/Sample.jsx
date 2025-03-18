import React, { useState, useEffect } from "react";
import { Row, Col, Container, Table } from "react-bootstrap";

const ExpenseReport = ({ data, reportRef }) => {
  const particulars = data?.items || [];
  const totalAmount = particulars.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <div ref={reportRef} className="expense-report">
      <Container>
        {/* details */}
        <Row className="mb-4 reference-section">
          <Col xs={6} className="mb-2">
            <p>
              <strong>Employee:</strong> {data?.employee || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Team Leader:</strong> {data?.teamLeader || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Date:</strong> {data?.date || " "}
            </p>
          </Col>
          <Col xs={6} className="mb-2">
            <p>
              <strong>Paid By:</strong> {data?.paidBy || " "}
            </p>
          </Col>
        </Row>

        {/* description */}
        <Row className="mb-4">
          <Col>
            <p>
              <strong>Reference:</strong> {data?.reference || " "}
            </p>
          </Col>
        </Row>

        {/* expense table */}
        <Table bordered className="expense-table">
          <thead>
            <tr>
              <th className="text-center">Label</th>
              <th className="text-center">Unit Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-center border-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {particulars.length > 0 ? (
              particulars.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item.label}</td>
                  <td className="text-center">
                    ₱{(item.price ?? 0).toFixed(2)}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center border-end">
                    ₱{item.amount ? parseFloat(item.amount).toFixed(2) : "0.00"}
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
              <td colSpan="3" className="text-end pe-3">
                <strong>Total:</strong>
              </td>
              <td className="text-center border-end">
                <strong>₱{totalAmount.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ExpenseReport;
