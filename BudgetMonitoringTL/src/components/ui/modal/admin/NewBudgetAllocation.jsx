import { useState } from "react";
import { Modal, Form, FloatingLabel } from "react-bootstrap";
import AppButton from "../../AppButton";

const departments = [
  "IT Department",
  "HR Department",
  "Admin Department",
  "Finance Department",
  "Marketing Department",
  "Operations",
  "Admin Department",
  "Finance Department",
  "Marketing Department",
  "Operations",
];

const NewBudgetAllocation = ({ show, onHide }) => {
  const [department, setDepartment] = useState("");
  const [budget, setBudget] = useState("");

  const handleClose = () => {
    setDepartment("");
    setBudget("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-md" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Allocate Budget
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          <Form.Group controlId="formDepartment" className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="form-control-sm small-input"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <FloatingLabel controlId="allocateBudget" label="Allocate Budget">
            <Form.Control
              type="number"
              name="allocateBudget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter amount"
              min="0"
              className="form-control-sm small-input"
            />
          </FloatingLabel>
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
          label="Confirm"
          variant="outline-success"
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewBudgetAllocation;
