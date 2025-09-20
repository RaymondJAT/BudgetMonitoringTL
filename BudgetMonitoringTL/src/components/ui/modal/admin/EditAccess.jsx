import { useState, useEffect, useCallback } from "react";
import { Modal, Form, FloatingLabel } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import { useNavigate } from "react-router-dom";

const EditAccess = ({ show, onHide, access, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (access && show) {
      setFormData({
        id: access.id || "",
        name: access.name || "",
        status: access.status || "active",
      });
    }
  }, [access, show]);

  const handleClose = () => {
    setSubmitting(false);
    onHide();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.value || "active",
    }));
  };

  const handleConfirm = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const payload = {
        id: formData.id,
        name: formData.name,
        status: formData.status,
      };

      const response = await fetch("/api5012/access/updateaccess", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("UpdateAccess API error:", errorText);
        throw new Error(errorText || "Failed to update access");
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Update access error:", error);
      alert(error.message || "Failed to update access");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-sm" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Edit Access
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
                value={formData.name}
                onChange={handleChange}
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
              value={statusOptions.find((opt) => opt.value === formData.status)}
              onChange={handleStatusChange}
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
          label={submitting ? "Processing..." : "Save Changes"}
          variant="outline-success"
          onClick={handleConfirm}
          disabled={submitting}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditAccess;
