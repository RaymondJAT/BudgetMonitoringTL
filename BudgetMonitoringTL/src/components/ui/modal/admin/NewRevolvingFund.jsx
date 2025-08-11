import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewRevolvingFund = ({ show, onHide, onAdd }) => {
  const navigate = useNavigate();

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [beginningAmount, setBeginningAmount] = useState("");
  const [addedAmount, setAddedAmount] = useState("");
  const [balanceError, setBalanceError] = useState("");

  const [budgetOptions, setBudgetOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const [loadingBudget, setLoadingBudget] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // HELPERS
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

  // FETCH BUDGET
  useEffect(() => {
    if (!show) return;
    const fetchBudgets = async () => {
      setLoadingBudget(true);
      try {
        const result = await authFetch("/api/budget/getbudget");
        const options = (result.data || []).map((b) => ({
          value: b.id,
          label: b.department,
          beginningAmount: b.amount || 0,
        }));
        setBudgetOptions(options);
      } catch (error) {
        console.error("Budget fetch error:", error);
      } finally {
        setLoadingBudget(false);
      }
    };

    fetchBudgets();
  }, [show, authFetch]);

  // FETCH BANK
  useEffect(() => {
    if (!show) return;
    const fetchBanks = async () => {
      setLoadingBank(true);
      try {
        const result = await authFetch(
          "/api/bank_accounts/activebank_accounts"
        );
        const options = (result.data || []).map((bank) => ({
          value: bank.mba_id,
          label: `${bank.mba_account_name}`,
        }));
        setBankOptions(options);
      } catch (error) {
        console.error("Bank fetch error:", error);
      } finally {
        setLoadingBank(false);
      }
    };

    fetchBanks();
  }, [show, authFetch]);

  const handleSelectBudget = (budget) => {
    setSelectedBudget(budget);
    setBeginningAmount(formatCurrency(budget.beginningAmount));
  };

  const handleAddedChange = (e) => {
    const value = e.target.value;
    setAddedAmount(value);

    // VALIDATION
    if (value && parseFloat(value) > 100000) {
      setBalanceError("Added amount exceeds maximum limit");
    } else {
      setBalanceError("");
    }
  };

  const handleClose = () => {
    setSelectedBudget(null);
    setSelectedBank(null);
    setBeginningAmount("");
    setAddedAmount("");
    setBalanceError("");
    onHide();
  };

  const handleConfirm = async () => {
    if (!selectedBudget || balanceError) return;

    setSubmitting(true);
    try {
      const payload = {
        budget_id: selectedBudget.value,
        bank_account_id: selectedBank?.value || null,
        beginning: sanitizeAmount(beginningAmount),
        added: selectedBank ? parseFloat(addedAmount) || 0 : 0,
      };

      const token = localStorage.getItem("token");
      const res = await fetch("/api/revolving_fund/createrevolving_fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const savedFund = await res.json();
      console.log("Saved fund:", savedFund);
      onAdd?.(savedFund.data);

      handleClose();
    } catch (error) {
      console.error("Create fund error:", error);
      alert(error.message || "Failed to create fund");
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
                isLoading={loadingBudget}
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
                isLoading={loadingBank}
                value={selectedBank}
                onChange={setSelectedBank}
                options={bankOptions}
                placeholder="Select Bank Account"
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
            !selectedBank ||
            !addedAmount ||
            !!balanceError
          }
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewRevolvingFund;
