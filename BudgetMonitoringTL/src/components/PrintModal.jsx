import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Container, Table } from "react-bootstrap";
import { numberToWords } from "../js/numberToWords";

const PrintModal = ({ show, onHide, data, amountInWords }) => {
  const [dateFiled, setDateFiled] = useState("");

  useEffect(() => {
    setDateFiled(new Date().toLocaleDateString());
  }, [show]);

  const particulars = data?.items || [];
  const totalAmount = particulars.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100 fw-bold">
          CASH REQUEST FORM
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {/* Employee Details */}
          <Row className="custom-col">
            <Col xs={12} md={6} className="d-flex align-items-center mb-2">
              <strong className="title">Name:</strong>
              <p className="ms-2 mb-0">{data?.employee || " "}</p>
            </Col>
            <Col xs={12} md={6} className="d-flex align-items-center mb-2">
              <strong className="title">Date Filed:</strong>
              <p className="ms-2 mb-0">{dateFiled}</p>
            </Col>
            <Col xs={12} md={6} className="d-flex align-items-center mb-2">
              <strong className="title">Position:</strong>
              <p className="ms-2 mb-0">{data?.position || " "}</p>
            </Col>
            <Col xs={12} md={6} className="d-flex align-items-center mb-2">
              <strong className="title">Department:</strong>
              <p className="ms-2 mb-0">{data?.department || " "}</p>
            </Col>
          </Row>

          {/* Particulars Table */}
          <Row>
            <Col xs={12}>
              <Table bordered className="custom-table">
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
                        <td className="text-center">
                          {`${item.label} - ${item.quantity} x ${(
                            item.price ?? 0
                          ).toFixed(2)}`}
                        </td>
                        <td className="text-center">
                          {item.amount
                            ? parseFloat(item.amount).toFixed(2)
                            : "0.00"}
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
                  <tr className="no-border">
                    <td className="text-end pe-3">
                      <strong>Total:</strong>
                    </td>
                    <td className="text-center">
                      <strong>{totalAmount.toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-start">
                      <strong>Amount in Words:</strong>{" "}
                      {amountInWords || "Zero"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Signatures */}
          <Row className="signature mt-4">
            <Col xs={12} md={4} className="text-center">
              <p className="mb-0">
                <strong>Requested by:</strong>
              </p>
              <div className="signature-box mt-4"></div>
            </Col>
            <Col xs={12} md={4} className="text-center">
              <p className="mb-0">
                <strong>Approved by:</strong>
              </p>
              <div className="signature-box mt-4"></div>
            </Col>
            <Col xs={12} md={4} className="text-center">
              <p className="mb-0">
                <strong>Received by:</strong>
              </p>
              <div className="signature-box mt-4"></div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PrintModal;
