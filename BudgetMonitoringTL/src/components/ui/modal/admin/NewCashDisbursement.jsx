import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewCashDisbursement = ({ show, onHide, fundOptions = [], onAdd }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    revolving_fund_id: null,
    received_by: "",
    department: "",
    particulars: "",
    cash_voucher: "",
    amount_issue: "",
    amount_return: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [remainingBalance, setRemainingBalance] = useState("");
  const [loadingFundBudget, setLoadingFundBudget] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [revolvingFundOptions, setRevolvingFundOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (amount) =>
    `₱ ${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const sanitizeAmount = (value) =>
    parseFloat((value || "").replace(/[₱, ]/g, "")) || 0;

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

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

  // FETCH REVOLVING FUND
  useEffect(() => {
    if (!show) return;
    const fetchRevolvingFund = async () => {
      setLoadingFundBudget(true);
      try {
        const result = await authFetch("/api/revolving_fund/getrevolving_fund");
        const options = (result.data || []).map((b) => ({
          value: b.id,
          label: `${b.name}`,
          remainingBalance: b.balance || 0,
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

  // FETCH EMPLOYEE
  useEffect(() => {
    if (!show) return;
    const fetchEmployee = async () => {
      setLoadingEmployee(true);
      try {
        const result = await authFetch("/api/employee/getemployee/");
        const employeeOptions = (result.data || []).map((b) => ({
          value: b.employee_id,
          label: b.fullname,
          department_id: b.department_id,
          department: b.department,
        }));
        setEmployeeOptions(employeeOptions);
      } catch (error) {
        console.error("Employee fetch error", error);
      } finally {
        setLoadingEmployee(false);
      }
    };
    fetchEmployee();
  }, [show, authFetch]);

  const handleClose = () => {
    setSelectedFund(null);
    setRemainingBalance("");
    setSelectedEmployee(null);
    setEmployeeDepartment("");
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDepartment(employee.department);
  };

  const handleFundSelect = (selectedOption) => {
    setSelectedFund(selectedOption);
    setRemainingBalance(formatCurrency(selectedOption.remainingBalance));
  };

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
        revolving_fund_id: selectedFund.value,
        received_by: selectedEmployee.value,
        department_id: selectedEmployee.department_id,
        particulars: formData.particulars,
        cash_voucher: formData.cash_voucher,
        amount_issue: parseFloat(formData.amount_issue) || 0,
        amount_return: parseFloat(formData.amount_return) || 0,
      };

      const response = await fetch(
        "/api/cash_disbursement/createcash_disbursement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create disbursement");
      }

      const result = await response.json();
      onAdd(result.data);
      handleClose();
    } catch (error) {
      console.error("Create disbursement error:", error);
      alert(error.message || "Failed to create cash disbursement");
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
          Cash Disbursement
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          {/* Revolving Fund ID - as Select */}
          <Row className="g-1">
            <Col md={8}>
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.75rem" }}>
                  Revolving Fund ID
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
            <Col md={4}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Remaining Balance
              </Form.Label>
              <Form.Control
                type="text"
                value={remainingBalance}
                disabled
                style={{ fontSize: "0.75rem", height: "38px" }}
              />
            </Col>
          </Row>

          {/* Received By and Department */}
          <Row className="mb-2 g-1">
            <Col>
              <Form.Group>
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
            <Col>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Department
              </Form.Label>
              <Form.Control
                type="text"
                value={employeeDepartment}
                disabled
                style={{ fontSize: "0.75rem", height: "38px" }}
              />
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
                required
                className="form-control-sm"
              />
            </FloatingLabel>
          </Form.Group>

          {/* Cash Voucher */}
          <Form.Group className="mb-2">
            <FloatingLabel
              controlId="cash_voucher"
              label="Cash Voucher"
              className="text-dark"
              style={{ fontSize: "0.75rem" }}
            >
              <Form.Control
                type="text"
                name="cash_voucher"
                value={formData.cash_voucher}
                onChange={handleChange}
                placeholder="Cash Voucher"
                className="form-control-sm"
                required
              />
            </FloatingLabel>
          </Form.Group>

          {/* Amount Issue and Return */}
          <Row className="mb-2 g-1">
            <Col>
              <FloatingLabel
                controlId="amount_issue"
                label="Amount Issue"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  name="amount_issue"
                  value={formData.amount_issue}
                  onChange={handleChange}
                  min="0"
                  placeholder="Amount Issue"
                  className="form-control-sm"
                  required
                  disabled={!!formData.amount_return}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="amount_return"
                label="Amount Return"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  name="amount_return"
                  value={formData.amount_return}
                  onChange={handleChange}
                  min="0"
                  placeholder="Amount Return"
                  className="form-control-sm"
                  required
                  disabled={!!formData.amount_issue}
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
          onClick={handleConfirm}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewCashDisbursement;
