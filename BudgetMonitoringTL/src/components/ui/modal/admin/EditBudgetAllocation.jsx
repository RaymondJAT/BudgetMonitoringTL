import { useState, useEffect } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";

const EditBudgetAllocation = ({ show, onHide, budgetItem = {}, onSave }) => {
  const [department, setDepartment] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (budgetItem) {
      setDepartment(budgetItem.department || "");
      setBudget(budgetItem.amount || "");
    }
  }, [budgetItem]);

  const handleClose = () => {
    onHide();
    setDepartment("");
    setBudget("");
  };

  const handleSave = () => {
    const updated = { ...budgetItem, department, amount: Number(budget) };
    onSave(updated);
    handleClose();
  };

  if (!budgetItem) return null;

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-md" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Edit Budget
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <Form className="text-white">
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Department
              </Form.Label>
              <Form.Control
                type="text"
                value={budgetItem.department}
                disabled
                onChange={(e) => setDepartment(e.target.value)}
                className="form-control-sm small-input"
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FloatingLabel
                controlId="editBudget"
                label="Allocated Budget"
                className="mb-2 text-dark small"
              >
                <Form.Control
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      ["e", "E", "+", "-"].includes(e.key) ||
                      (e.ctrlKey && e.key === "v")
                    ) {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                  className="form-control-sm small-input"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={handleClose}
          className="custom-app-button"
        />
        <AppButton
          label="Save Changes"
          variant="outline-success"
          onClick={handleSave}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditBudgetAllocation;
