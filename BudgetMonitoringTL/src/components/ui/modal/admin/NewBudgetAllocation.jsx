import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { types } from "../../../../constants/departmentModal";
import { customStyles } from "../../../../constants/customStyles";

import AppButton from "../../AppButton";

const NewBudgetAllocation = ({ show, onHide, onAdd }) => {
  const navigate = useNavigate();

  const [bank, setBank] = useState(null);
  const [department, setDepartment] = useState(null);
  const [type, setType] = useState(null);
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [bankData, setBankData] = useState([]);
  const [allocatedPerBank, setAllocatedPerBank] = useState({});

  const [bankBalance, setBankBalance] = useState(null);
  const [bankError, setBankError] = useState(null);
  const [balanceError, setBalanceError] = useState("");
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departmentError, setDepartmentError] = useState(null);

  // FETCH BANK ACCOUNTS
  useEffect(() => {
    const fetchBankAccounts = async () => {
      setLoadingBankAccounts(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("/api/bank_accounts/activebank_accounts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch bank accounts");

        const result = await res.json();
        setBankData(result.data || []);
      } catch (error) {
        console.error("Bank Fetch Error:", error);
        setBankError(error.message);
      } finally {
        setLoadingBankAccounts(false);
      }
    };

    fetchBankAccounts();
  }, [navigate]);

  // FETCH DEPARTMENTS
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("/api/departments/getdepartments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch departments");

        const result = await res.json();
        setDepartmentList(result.data || []);
      } catch (error) {
        console.error("Department Fetch Error:", error);
        setDepartmentError(error.message);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [navigate]);

  // FETCH BANK BALANCE
  const fetchBankBalance = async (bankId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const res = await fetch(
        `/api/bank_balances/getbank_balance_by_id?id=${bankId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch bank balance.");

      const result = await res.json();
      setBankBalance(result.data?.[0]?.bb_current_amount || 0);
    } catch (error) {
      console.error("Bank Balance Fetch Error:", error);
      setBankBalance(0);
      setBalanceError("Failed to fetch bank balance.");
    }
  };

  // OPTIONS
  const departmentOptions = useMemo(
    () =>
      departmentList.map((d) => ({
        value: d.id,
        label: d.description,
      })),
    [departmentList]
  );

  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t, label: t })),
    []
  );
  const bankOptions = useMemo(
    () =>
      bankData.map((b) => ({
        value: b.mba_id,
        label: `${b.mba_bank_type} - ${b.mba_account_name}`,
      })),
    [bankData]
  );

  // HANDLERS
  const handleClose = () => {
    setBank(null);
    setDepartment(null);
    setType(null);
    setBudget("");
    setDescription("");
    setBankBalance(null);
    setBalanceError("");
    onHide();
  };

  const handleConfirm = async () => {
    if (!budget || !department || !type || !!balanceError || !bank) return;

    const payload = {
      bank_account_id: bank.value,
      department_id: department.value,
      type: type.value,
      amount: parseFloat(budget),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const res = await fetch("/api/budget/createbudget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("API Error Response:", result);
        throw new Error(result.message || "Failed to allocate budget.");
      }

      const newItem = {
        id: result.data?.id,
        department: `${department.label}-${type.label}`,
        total_fund: parseFloat(budget),
        remaining_budget: parseFloat(budget),
        issued_amount: 0,
        remaining_amount: parseFloat(budget),
        utilization: 0,
        bank_account: bank.label,

        description: description,
        createdAt: new Date().toISOString(),
      };
      onAdd?.(newItem);

      setAllocatedPerBank((prev) => {
        const current = prev[bank.value] || 0;
        return {
          ...prev,
          [bank.value]: current + parseFloat(budget),
        };
      });

      handleClose();
    } catch (error) {
      console.error("Create Budget Error:", error);
      alert(error.message || "Failed to create budget.");
    }
  };

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    setBudget(value);

    const totalAllocated = allocatedPerBank[bank?.value] || 0;
    const remaining = bankBalance - totalAllocated;

    setBalanceError(
      parseFloat(value) > remaining
        ? "Allocated budget exceeds remaining available balance."
        : ""
    );
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
          {/* BANK ACCOUNT */}
          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Bank Account
              </Form.Label>
              <Select
                isLoading={loadingBankAccounts}
                value={bank}
                onChange={(b) => {
                  setBank(b);
                  fetchBankBalance(b.value);
                }}
                options={bankOptions}
                placeholder={
                  bankError
                    ? "Failed to load bank accounts"
                    : "Select Bank Account"
                }
                styles={customStyles}
              />
            </Col>
          </Row>

          {/* DEPARTMENT & TYPE */}
          <Row className="mb-3 g-2">
            <Col xs={8}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Department
              </Form.Label>
              <Select
                isLoading={loadingDepartments}
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
                placeholder={
                  departmentError
                    ? "Failed to load departments"
                    : "Select Department"
                }
                styles={customStyles}
              />
            </Col>
            <Col xs={4}>
              <Form.Label style={{ fontSize: "0.75rem" }}>Type</Form.Label>
              <Select
                value={type}
                onChange={setType}
                options={typeOptions}
                placeholder="Type"
                styles={customStyles}
              />
            </Col>
          </Row>

          {/* ALLOCATE BUDGET */}
          <Row className="mb-3">
            <Col md={12}>
              <FloatingLabel
                controlId="allocateBudget"
                label="Allocate Budget"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  type="number"
                  value={budget}
                  onChange={handleNumberInput}
                  onKeyDown={preventInvalidKeys}
                  placeholder="Enter amount"
                  min="0"
                  className="form-control-sm small-input"
                />
              </FloatingLabel>

              {balanceError && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  {balanceError}
                </div>
              )}
            </Col>
          </Row>

          {/* DESCRIPTION */}
          <Row>
            <Col md={12}>
              <FloatingLabel
                controlId="description"
                label="Description"
                className="text-dark"
                style={{ fontSize: "0.75rem" }}
              >
                <Form.Control
                  as="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                  style={{ height: "80px", fontSize: "0.75rem" }}
                  className="form-control-sm"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        {/* BUTTONS */}
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
          disabled={!!balanceError || !budget || !bank || !department || !type}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewBudgetAllocation;
