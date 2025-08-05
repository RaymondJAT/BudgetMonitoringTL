import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";
import AppButton from "../../AppButton";

import { departments, types } from "../../../../constants/departmentModal";
import { customStyles } from "../../../../constants/customStyles";

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
    () => departments.map((d) => ({ value: d, label: d })),
    []
  );
  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t, label: t })),
    []
  );
  const bankOptions = useMemo(
    () =>
      bankData.map((b) => ({
        value: b.mba_id,
        label: `${b.mba_bank_type} - ${b.mba_account_name} (${b.mba_account_number})`,
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

  const handleConfirm = () => {
    if (!budget || !department || !type || !!balanceError) return;

    const payload = {
      bank_id: bank.value,
      department: department.value,
      type: type.value,
      amount: parseFloat(budget),
      description,
    };

    const fakeId = Date.now();

    onAdd({
      id: fakeId,
      department: payload.department,
      type: payload.type,
      allocated: payload.amount,
      used: 0,
      description: payload.description,
      bank: bank.label,
    });

    setAllocatedPerBank((prev) => {
      const current = prev[bank.value] || 0;
      return {
        ...prev,
        [bank.value]: current + parseFloat(budget),
      };
    });

    handleClose();
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
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
                placeholder="Select Department"
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

              {bankBalance !== null && (
                <div
                  className={`mt-1 ${
                    balanceError ? "text-danger" : "text-info"
                  }`}
                  style={{ fontSize: "0.7rem" }}
                >
                  Remaining Balance: ₱
                  {(() => {
                    const totalAllocated = allocatedPerBank[bank?.value] || 0;
                    const remaining =
                      bankBalance - totalAllocated - parseFloat(budget || 0);
                    return Math.max(0, remaining).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  })()}
                </div>
              )}

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
