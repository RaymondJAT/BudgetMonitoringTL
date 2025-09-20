import { useState } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";
import AppButton from "../../buttons/AppButton";

const TransferBudgetAllocation = ({
  show,
  onHide,
  fromDepartment,
  departments = [],
  onTransfer,
}) => {
  const [toDept, setToDept] = useState(null);
  const [amounts, setAmount] = useState("");

  const remaining = fromDepartment
    ? Math.max(
        0,
        (Number(fromDepartment.amount) || 0) -
          (Number(fromDepartment.used) || 0)
      )
    : 0;

  const handleTransfer = () => {
    const transferAmt = Number(amounts);
    if (
      transferAmt > 0 &&
      toDept &&
      fromDepartment &&
      transferAmt <= remaining
    ) {
      onTransfer(fromDepartment, toDept.value, transferAmt);
      setAmount("");
      setToDept(null);
      onHide();
    }
  };

  const validDepts = departments
    .filter((d) => d.department !== fromDepartment?.department)
    .map((d) => ({
      value: d.department,
      label: d.department,
    }));

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-md" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Transfer Funds
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <Form className="text-white">
          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                From Department
              </Form.Label>
              <Form.Control
                value={fromDepartment?.department || ""}
                disabled
                className="form-control-sm small-input"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Transfer To
              </Form.Label>
              <Select
                value={toDept}
                onChange={setToDept}
                options={validDepts}
                placeholder="Select Department"
                styles={{
                  control: (base) => ({
                    ...base,
                    fontSize: "0.75rem",
                    minHeight: "30px",
                    color: "black",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "black",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    fontSize: "0.75rem",
                    backgroundColor: isSelected
                      ? "#800000"
                      : isFocused
                      ? "#f8d7da"
                      : "white",
                    color: isSelected ? "white" : "black",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: "150px",
                    overflowY: "auto",
                  }),
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FloatingLabel
                controlId="transferAmount"
                label="Amount to Transfer"
                className="text-dark mb-2"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  value={amounts}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      ["e", "E", "+", "-"].includes(e.key) ||
                      (e.ctrlKey && e.key === "v")
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter amount"
                  min="0"
                  max={remaining}
                  className="form-control-sm small-input"
                />
              </FloatingLabel>
              <small className="text-light small-input">
                Remaining Budget: <b>₱{remaining.toLocaleString()}</b>
              </small>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
        <AppButton
          label="Transfer"
          variant="outline-success"
          onClick={handleTransfer}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default TransferBudgetAllocation;
