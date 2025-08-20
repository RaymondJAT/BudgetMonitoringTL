import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";

import AppButton from "../../AppButton";
import { customStyles } from "../../../../constants/customStyles";

const EditCashDisbursement = ({ show, onHide, onSuccess, disbursement }) => {
  const navigate = useNavigate();

  //  STATE
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [selectedFund, setSelectedFund] = useState(null);

  const [loadingFundBudget, setLoadingFundBudget] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [revolvingFundOptions, setRevolvingFundOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [formData, setFormData] = useState({
    particulars: "",
    cash_voucher: "",
    amount_issue: "",
    amount_return: "",
    amount_expended: "",
  });

  //  HELPERS
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  FETCH REVOLVING FUND
  useEffect(() => {
    if (!show) return;

    const fetchRevolvingFund = async () => {
      setLoadingFundBudget(true);
      try {
        const result = await authFetch("/api/revolving_fund/getrevolving_fund");
        const options = (result.data || []).map((fund) => ({
          value: fund.id,
          label: fund.name,
          remainingBalance: fund.balance || 0,
        }));
        setRevolvingFundOptions(options);
      } catch (error) {
        console.error("Budget fetch error:", error);
      } finally {
        setLoadingFundBudget(false);
      }
    };

    fetchRevolvingFund();
  }, [show, authFetch]);

  //  FETCH EMPLOYEE
  useEffect(() => {
    if (!show) return;

    const fetchEmployee = async () => {
      setLoadingEmployee(true);
      try {
        const result = await authFetch("/api/employee/getemployee/");
        const options = (result.data || []).map((emp) => ({
          value: emp.employee_id,
          label: emp.fullname,
          department_id: emp.department_id,
          department: emp.department,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        console.error("Employee fetch error:", error);
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [show, authFetch]);

  //   DISPLAY PRESENT DATA
  useEffect(() => {
    if (show && disbursement) {
      setSelectedFund(
        disbursement.revolving_fund_id
          ? {
              value: disbursement.revolving_fund_id,
              label: disbursement.revolving_fund_label,
            }
          : null
      );

      setSelectedEmployee(
        disbursement.received_by
          ? {
              value: disbursement.received_by_id,
              label: disbursement.received_by,
              department: disbursement.description || "",
              department_id: disbursement.department_id || "",
            }
          : null
      );

      setEmployeeDepartment(disbursement.description || "");

      setFormData({
        particulars: disbursement.particulars || "",
        cash_voucher: disbursement.cash_voucher || "",
        amount_issue: disbursement.amount_issue || "",
        amount_return: disbursement.amount_return || "",
        amount_expended: disbursement.amount_expended || "",
      });
    }
  }, [show, disbursement]);

  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeDepartment(selectedEmployee.department || "");
    } else {
      setEmployeeDepartment("");
    }
  }, [selectedEmployee]);

  const handleFundSelect = (fund) => setSelectedFund(fund);
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDepartment(employee.department);
  };

  //  SUBMIT
  const handleConfirm = async () => {
    if (!selectedEmployee || !selectedFund) {
      alert("Please select both Employee and Revolving Fund.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const payload = {
        id: disbursement?.id,
        rf_id: selectedFund.value,
        received_by: selectedEmployee.value,
        department_id: selectedEmployee.department_id,
        particulars: formData.particulars,
        cash_voucher: formData.cash_voucher,
        amount_issue: parseFloat(formData.amount_issue) || 0,
        amount_return: parseFloat(formData.amount_return) || 0,
        amount_expended: parseFloat(formData.amount_expended) || 0,
      };

      const response = await fetch(
        "/api/cash_disbursement/updatecash_disbursement_id",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update disbursement");
      }

      await response.json();

      // 🔑 NEW: refresh parent then close modal
      if (onSuccess) onSuccess();
      onHide();
    } catch (error) {
      console.error("Update disbursement error:", error);
      alert(error.message || "Failed to update cash disbursement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      dialogClassName="modal-md"
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title>Edit Cash Disbursement</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <Form className="text-white">
          {/* FUND and EMPLOYEE */}
          <Row className="g-2 mb-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.75rem" }}>
                  Revolving Fund
                </Form.Label>
                <Select
                  isLoading={loadingFundBudget}
                  value={selectedFund}
                  onChange={handleFundSelect}
                  options={revolvingFundOptions}
                  placeholder="Select Revolving Fund"
                  styles={customStyles}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.75rem" }}>
                  Received By
                </Form.Label>
                <Select
                  isLoading={loadingEmployee}
                  value={selectedEmployee}
                  onChange={handleEmployeeSelect}
                  options={employeeOptions}
                  styles={customStyles}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* VOUCHER and DEPARTMENT */}
          <Row className="mb-3 g-2">
            <Col md={6}>
              <FloatingLabel
                controlId="cash_voucher"
                label="Cash Voucher"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="text"
                  name="cash_voucher"
                  placeholder="Cash Voucher..."
                  value={formData.cash_voucher}
                  onChange={handleInputChange}
                  style={{ height: "50px", fontSize: "0.75rem" }}
                  required
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId="department"
                label="Department"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="text"
                  name="department"
                  value={employeeDepartment}
                  readOnly
                  style={{ height: "50px", fontSize: "0.75rem" }}
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
          </Row>

          {/* PARTICULARS */}
          <Row className="g-2 mb-3">
            <Col>
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
                  placeholder="Particulars..."
                  value={formData.particulars}
                  onChange={handleInputChange}
                  style={{ height: "50px", fontSize: "0.75rem" }}
                  required
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
          </Row>

          {/* AMOUNTS */}
          <Row className="g-2 mb-2">
            {["amount_issue", "amount_return", "amount_expended"].map(
              (field) => (
                <Col md={4} key={field}>
                  <FloatingLabel
                    controlId={field}
                    label={field
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    className="text-dark"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Form.Control
                      type="number"
                      name={field}
                      placeholder={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      style={{ height: "50px", fontSize: "0.75rem" }}
                      required
                      className="form-control-sm"
                    />
                  </FloatingLabel>
                </Col>
              )
            )}
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
          label="Confirm"
          variant="outline-success"
          onClick={handleConfirm}
          className="custom-app-button"
          disabled={submitting}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditCashDisbursement;
