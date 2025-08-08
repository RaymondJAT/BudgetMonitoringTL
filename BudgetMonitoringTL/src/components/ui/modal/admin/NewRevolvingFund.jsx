import { useState, useEffect, useMemo } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewRevolvingFund = ({ show, onHide, onAdd }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [beginningAmount, setBeginningAmount] = useState("");
  const [addedAmount, setAddedAmount] = useState("");
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [bankBalance, setBankBalance] = useState(null);

  const [bankError, setBankError] = useState(null);
  const [balanceError, setBalanceError] = useState("");
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Format currency
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

  // Fetch Budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch("/api/budget/getbudget", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch budget list");

        const result = await res.json();
        const options = (result.data || []).map((b) => ({
          value: b.id,
          label: b.budget_name || b.code || b.department,
          beginningAmount: b.beginning_amount || b.amount || 0,
        }));
        setBudgetOptions(options);
      } catch (err) {
        console.error("Budget fetch error:", err);
      } finally {
        setLoadingBudgets(false);
      }
    };

    fetchBudgets();
  }, []);

  // Fetch Banks
  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch("/api/bank_accounts/activebank_accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch bank accounts");

        const result = await res.json();
        const options = (result.data || []).map((b) => ({
          value: b.mba_id,
          label: `${b.mba_bank_type} - ${b.mba_account_name}`,
        }));
        setBankOptions(options);
      } catch (err) {
        console.error("Bank fetch error:", err);
        setBankError(err.message);
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  // Fetch Bank Balance
  const fetchBankBalance = async (bankId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `/api/bank_balances/getbank_balance_by_id?id=${bankId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch bank balance");

      const result = await res.json();
      setBankBalance(result.data?.[0]?.bb_current_amount || 0);
    } catch (err) {
      console.error("Bank balance fetch error:", err);
      setBankBalance(0);
      setBalanceError("Failed to fetch bank balance.");
    }
  };

  // Handle Select Budget
  const handleSelectBudget = (budget) => {
    setSelectedBudget(budget);
    setBeginningAmount(formatCurrency(budget.beginningAmount));
  };

  // Handle Added Amount Validation
  const handleAddedChange = (e) => {
    const value = e.target.value;
    setAddedAmount(value);

    if (bankBalance !== null) {
      const remaining = bankBalance;
      setBalanceError(
        parseFloat(value) > remaining
          ? "Added amount exceeds available bank balance."
          : ""
      );
    }
  };

  // Close modal
  const handleClose = () => {
    setSelectedBudget(null);
    setSelectedBank(null);
    setBeginningAmount("");
    setAddedAmount("");
    setBankBalance(null);
    setBalanceError("");
    onHide();
  };

  const handleConfirm = async () => {
    if (!selectedBudget) return;
    if (selectedBank && (!addedAmount || !!balanceError)) return;

    const beginning = sanitizeAmount(beginningAmount);
    const added = parseFloat(addedAmount) || 0;

    const payload = {
      budget_id: selectedBudget.value,
      beginning,
      added,
    };

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const res = await fetch("/api/revolving_fund/createrevolving_fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create fund");

      // Pass full object to table
      onAdd?.();
      handleClose();
    } catch (error) {
      console.error("Create Fund Error:", error);
      alert(error.message);
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
          Revolving Fund
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Form className="text-white">
          <Row className="mb-2 g-2">
            <Col md={8}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Budget
              </Form.Label>
              <Select
                isLoading={loadingBudgets}
                value={selectedBudget}
                onChange={handleSelectBudget}
                options={budgetOptions}
                styles={customStyles}
                placeholder="Select Budget"
              />
            </Col>
            <Col md={4}>
              <Form.Label style={{ fontSize: "0.75rem" }}>Beginning</Form.Label>
              <Form.Control
                type="text"
                value={beginningAmount}
                disabled
                style={{ fontSize: "0.75rem", height: "38px" }}
              />
            </Col>
          </Row>

          <Row className="mb-2 g-2">
            <Col md={8}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Bank Account
              </Form.Label>
              <Select
                isLoading={loadingBanks}
                value={selectedBank}
                onChange={(b) => {
                  setSelectedBank(b);
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
            <Col md={4}>
              <Form.Label style={{ fontSize: "0.75rem" }}>Added</Form.Label>
              <Form.Control
                type="number"
                value={addedAmount}
                onChange={handleAddedChange}
                onKeyDown={preventInvalidKeys}
                min="0"
                style={{ fontSize: "0.75rem", height: "38px" }}
              />
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
          disabled={
            submitting ||
            !selectedBudget ||
            (selectedBank && (!addedAmount || !!balanceError))
          }
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewRevolvingFund;
