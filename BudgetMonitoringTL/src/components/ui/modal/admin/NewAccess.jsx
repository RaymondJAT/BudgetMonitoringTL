import { useState, useCallback } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import AppButton from "../../AppButton";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import { useNavigate } from "react-router-dom";

const NewAccess = ({ show, onHide, onAdd }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleClose = () => {
    setName("");
    setStatus("active");
    setSubmitting(false);
    onHide();
  };

  const handleConfirm = useCallback(async () => {
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api5012/access/createaccess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, status }),
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      onAdd?.(result.data);
      handleClose();
    } catch (error) {
      console.error("Create access error:", error);
      alert(error.message || "Failed to create access");
    } finally {
      setSubmitting(false);
    }
  }, [name, status, onAdd]);

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-sm" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          New Access
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          <Form.Group className="mb-2">
            <FloatingLabel
              controlId="accessName"
              label="Name"
              className="text-dark"
              style={{ fontSize: "0.75rem" }}
            >
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Access Name"
                className="form-control-sm"
                required
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group style={{ marginTop: "5px" }}>
            <Form.Label style={{ fontSize: "0.75rem", marginBottom: "4px" }}>
              Status
            </Form.Label>
            <Select
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === status)}
              onChange={(selectedOption) =>
                setStatus(selectedOption?.value || "active")
              }
              placeholder="Select Status"
              styles={customStyles}
              isClearable
            />
          </Form.Group>
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
          label={submitting ? "Processing..." : "Confirm"}
          variant="outline-success"
          onClick={handleConfirm}
          disabled={submitting}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewAccess;
