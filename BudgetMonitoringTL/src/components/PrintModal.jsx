import React from "react";
import { Row, Col, Modal, Container, Button, Form } from "react-bootstrap";

const PrintModal = (props, data) => {
  return (
    <div>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-center w-100"
          >
            CASH REQUEST FORM
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row className="custom-col">
              <Col xs={12} md={6} className="d-flex align-items-center mb-2">
                <strong className="title">Name:</strong>
                <p className="ms-2 mb-0">{data?.name || " "}</p>
              </Col>
              <Col xs={12} md={6} className="d-flex align-items-center mb-2">
                <strong className="title">Date Filed:</strong>
                <p className="ms-2 mb-0">{data?.dateFiled || " "}</p>
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

            <Row>
              <Col xs={12}>
                <table className="custom-table table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">Particulars</th>
                      <th className="text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample */}
                    <tr>
                      <td className="text-start">Sample Item 1</td>
                      <td className="text-start">1,000.00</td>
                    </tr>
                    <tr>
                      <td className="text-start">Sample Item 2</td>
                      <td className="text-start">500.00</td>
                    </tr>
                    <tr>
                      <td className="text-start">Sample Item 3</td>
                      <td className="text-start">2,000.00</td>
                    </tr>
                    <tr>
                      <td className="border-0"></td>
                      <td className="text-start border-0">
                        <strong>₱</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row className="custom-col w-100">
              <Col xs={12} md={4} className="text-start">
                <strong>Requested By:</strong>
                <p className="mb-0">{data?.requestedBy || " "}</p>
              </Col>
              <Col xs={12} md={4} className="text-start">
                <strong>Approved By:</strong>
                <p className="mb-0">{data?.approvedBy || " "}</p>
              </Col>
              <Col xs={12} md={4} className="text-start">
                <strong>Received By:</strong>
                <p className="mb-0">{data?.receivedBy || " "}</p>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrintModal;
