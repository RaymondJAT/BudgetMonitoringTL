import { useState } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { departments } from "../../../../constants/departmentModal";

import AppButton from "../../AppButton";

const departmentOptions = departments.map((dept) => ({
  value: dept,
  label: dept,
}));

const NewBudgetAllocation = ({ show, onHide }) => {
  const [department, setDepartment] = useState(null);
  const [budget, setBudget] = useState("");

  const handleClose = () => {
    setDepartment(null);
    setBudget("");
    onHide();
  };

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      e.target.value = "0";
    }
    setBudget(e.target.value);
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
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Department
              </Form.Label>
              <Select
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
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
                controlId="allocateBudget"
                label="Allocate Budget"
                className="mb-2 text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  name="allocateBudget"
                  value={budget}
                  onChange={handleNumberInput}
                  onKeyDown={preventInvalidKeys}
                  placeholder="Enter amount"
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
