import { useState } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewCashDisbursement = ({ show, onHide, fundOptions = [] }) => {
  const [formData, setFormData] = useState({
    revolvingFundId: null,
    receivedBy: "",
    department: "",
    particulars: "",
    cashVoucher: "",
    amountIssue: "",
    amountReturn: "",
  });

  const handleClose = () => {
    setFormData({
      revolvingFundId: null,
      receivedBy: "",
      department: "",
      particulars: "",
      cashVoucher: "",
      amountIssue: "",
      amountReturn: "",
    });
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFundSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      revolvingFundId: selectedOption,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted data:", {
      ...formData,
      revolvingFundId: formData.revolvingFundId?.value || null,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-md" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Cash Disbursement
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          {/* Revolving Fund ID - as Select */}
          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: "0.75rem" }}>
              Revolving Fund ID
            </Form.Label>
            <Select
              value={formData.revolvingFundId}
              onChange={handleFundSelect}
              options={fundOptions}
              placeholder="Select Revolving Fund"
              styles={customStyles}
            />
          </Form.Group>

          {/* Received By and Department */}
          <Row className="mb-2 g-1">
            <Col>
              <FloatingLabel
                controlId="receivedBy"
                label="Received By"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="text"
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  placeholder="Received By"
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="department"
                label="Department"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
          </Row>

          {/* Particulars */}
          <Form.Group className="mb-2">
            <FloatingLabel
              controlId="particulars"
              label="Particulars"
              className="text-dark"
              style={{ fontSize: "0.75rem" }}
            >
              <Form.Control
                as="textarea"
                rows={2}
                name="particulars"
                value={formData.particulars}
                onChange={handleChange}
                placeholder="Enter particulars"
                style={{ height: "80px", fontSize: "0.75rem" }}
                className="form-control-sm"
              />
            </FloatingLabel>
          </Form.Group>

          {/* Cash Voucher */}
          <Form.Group className="mb-2">
            <FloatingLabel
              controlId="cashVoucher"
              label="Cash Voucher"
              className="text-dark"
              style={{ fontSize: "0.75rem" }}
            >
              <Form.Control
                type="text"
                name="cashVoucher"
                value={formData.cashVoucher}
                onChange={handleChange}
                placeholder="Cash Voucher"
                className="form-control-sm"
              />
            </FloatingLabel>
          </Form.Group>

          {/* Amount Issue and Return */}
          <Row className="mb-2 g-1">
            <Col>
              <FloatingLabel
                controlId="amountIssue"
                label="Amount Issue"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  name="amountIssue"
                  value={formData.amountIssue}
                  onChange={handleChange}
                  min="0"
                  placeholder="Amount Issue"
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="amountReturn"
                label="Amount Return"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  name="amountReturn"
                  value={formData.amountReturn}
                  onChange={handleChange}
                  min="0"
                  placeholder="Amount Return"
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={handleClose}
          className="custom-app-button"
        />
        <AppButton
          label="Submit"
          variant="outline-success"
          onClick={handleSubmit}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewCashDisbursement;
