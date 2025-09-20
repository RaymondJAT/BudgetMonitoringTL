import { useState, useEffect, useCallback } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import { useNavigate } from "react-router-dom";

const EditUser = ({ show, onHide, user, onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    employee_id: "",
    fullname: "",
    username: "",
    password: "",
    access_id: "",
    status: "active",
  });
  const [accessOptions, setAccessOptions] = useState([]);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (user && show) {
      setFormData({
        id: user.id || "",
        employee_id: user.employee_id || "",
        fullname: user.fullname || "",
        username: user.username || "",
        password: "",
        access_id: user.access_id || "",
        status: user.status || "active",
      });
    }
  }, [user, show]);

  const authFetch = useCallback(
    async (url) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
      }

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "API request failed");
      }

      return res.json();
    },
    [navigate]
  );

  useEffect(() => {
    if (!show) return;

    const fetchAccessOptions = async () => {
      setLoadingAccess(true);
      try {
        const result = await authFetch("/api5001/access/getaccess");
        setAccessOptions(
          (result.data || []).map((a) => ({ value: a.id, label: a.name }))
        );
      } catch (error) {
        console.error("Access fetch error:", error);
      } finally {
        setLoadingAccess(false);
      }
    };

    fetchAccessOptions();
  }, [show, authFetch]);

  const handleClose = () => {
    setSubmitting(false);
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      access_id: selectedOption?.value || "",
    }));
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption?.value || "active",
    }));
  };

  const handleConfirm = async () => {
    if (
      !formData.employee_id ||
      !formData.fullname ||
      !formData.username ||
      !formData.access_id
    ) {
      alert("Please fill out required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const payload = {
        id: formData.id,
        employee_id: formData.employee_id,
        fullname: formData.fullname,
        username: formData.username,
        access: formData.access_id,
        status: formData.status,
      };

      if (formData.password?.trim()) {
        payload.password = formData.password;
      }

      const response = await fetch("/api5001/users/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("UpdateUser API error:", errorText);
        throw new Error(errorText || "Failed to update user");
      }

      if (onSuccess) onSuccess();

      handleClose();
    } catch (error) {
      console.error("Update user error:", error);
      alert(error.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-md" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Edit User
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          <Form.Group className="mb-2">
            <FloatingLabel
              controlId="fullname"
              label="Full Name"
              className="text-dark"
              style={{ fontSize: "0.75rem" }}
            >
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="form-control-sm"
                required
              />
            </FloatingLabel>
          </Form.Group>

          <Row className="gx-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <FloatingLabel
                  controlId="employee_id"
                  label="Employee ID"
                  className="text-dark"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Form.Control
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="Employee ID"
                    className="form-control-sm"
                    required
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <FloatingLabel
                  controlId="username"
                  label="Username"
                  className="text-dark"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="form-control-sm"
                    required
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-2">
            <Col md={6}>
              <Form.Group className="mb-2" style={{ marginTop: "-7px" }}>
                <Form.Label
                  style={{ fontSize: "0.75rem", marginBottom: "4px" }}
                >
                  Access Level
                </Form.Label>
                <Select
                  options={accessOptions}
                  value={accessOptions.find(
                    (opt) => opt.value === formData.access_id
                  )}
                  onChange={handleAccessChange}
                  placeholder={loadingAccess ? "Loading..." : "Select Access"}
                  styles={customStyles}
                  isClearable
                  isDisabled={loadingAccess}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2" style={{ marginTop: "-7px" }}>
                <Form.Label
                  style={{ fontSize: "0.75rem", marginBottom: "4px" }}
                >
                  Status
                </Form.Label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(
                    (opt) => opt.value === formData.status
                  )}
                  onChange={handleStatusChange}
                  placeholder="Select Status"
                  styles={customStyles}
                  isClearable
                />
              </Form.Group>
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

export default EditUser;
