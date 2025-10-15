import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../buttons/AppButton";
import Swal from "sweetalert2";

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
  const [focusedField, setFocusedField] = useState(null);

  const formatCurrency = (amount) =>
    `₱ ${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPeso = (val) =>
    "₱" +
    Number(val || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const parsePeso = (val) => {
    if (!val) return "";
    return val.toString().replace(/[^0-9.]/g, "");
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
        const result = await authFetch(
          "/api5001/revolving_fund/getrevolving_fund"
        );
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
        const result = await authFetch("/api5001/employee/getemployee/");
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

  // RESET MODAL WHEN CLOSE
  useEffect(() => {
    if (!show) {
      setFormData({
        revolving_fund_id: null,
        received_by: "",
        department: "",
        particulars: "",
        cash_voucher: "",
        amount_issue: "",
        amount_return: "",
      });
      setSelectedFund(null);
      setRemainingBalance("");
      setSelectedEmployee(null);
      setEmployeeDepartment("");
      setFocusedField(null);
    }
  }, [show]);

  const handleClose = () => {
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
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please select both Employee and Revolving Fund.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    // 🔸 NEW REQUIRED FIELD VALIDATION
    if (
      !formData.particulars.trim() ||
      !formData.cash_voucher.trim() ||
      (!formData.amount_issue && !formData.amount_return)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Required Fields",
        text: "Please complete Particulars, Cash Voucher, and at least one of Amount Issue or Amount Return.",
        confirmButtonColor: "#800000",
      });
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
        particulars: formData.particulars.trim(),
        cash_voucher: formData.cash_voucher.trim(),
        amount_issue: parseFloat(formData.amount_issue) || 0,
        amount_return: parseFloat(formData.amount_return) || 0,
      };

      const response = await fetch(
        "/api5001/cash_disbursement/createcash_disbursement",
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

      await Swal.fire({
        icon: "success",
        title: "Cash Disbursement Created!",
        text: "The disbursement has been successfully added.",
        confirmButtonColor: "#800000",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      handleClose();
    } catch (error) {
      console.error("Create disbursement error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create cash disbursement.",
        confirmButtonColor: "#800000",
      });
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

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <Form className="text-white">
          {/* REVOLVING FUND SELECT ID */}
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

          {/* RECEIVED AND DEPARTMENT */}
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

          {/* PARTICULARS */}
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

          {/* CASH VOUCHER */}
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

          {/* AMOUNT ISSUE AND RETURN */}
          <Row className="mb-2 g-1">
            <Col>
              <FloatingLabel
                controlId="amount_issue"
                label="Amount Issue"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="text"
                  name="amount_issue"
                  placeholder="₱0.00"
                  value={
                    focusedField === "issue"
                      ? formData.amount_issue
                      : formData.amount_issue
                      ? formatPeso(formData.amount_issue)
                      : ""
                  }
                  onChange={(e) => {
                    const raw = parsePeso(e.target.value);
                    setFormData((prev) => ({ ...prev, amount_issue: raw }));
                  }}
                  onFocus={() => setFocusedField("issue")}
                  onBlur={() => {
                    setFormData((prev) => ({
                      ...prev,
                      amount_issue: prev.amount_issue
                        ? parseFloat(prev.amount_issue).toFixed(2)
                        : "",
                    }));
                    setFocusedField(null);
                  }}
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
                  type="text"
                  name="amount_return"
                  placeholder="₱0.00"
                  value={
                    focusedField === "return"
                      ? formData.amount_return
                      : formData.amount_return
                      ? formatPeso(formData.amount_return)
                      : ""
                  }
                  onChange={(e) => {
                    const raw = parsePeso(e.target.value);
                    setFormData((prev) => ({ ...prev, amount_return: raw }));
                  }}
                  onFocus={() => setFocusedField("return")}
                  onBlur={() => {
                    setFormData((prev) => ({
                      ...prev,
                      amount_return: prev.amount_return
                        ? parseFloat(prev.amount_return).toFixed(2)
                        : "",
                    }));
                    setFocusedField(null);
                  }}
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
