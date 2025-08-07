import { useState, useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewRevolvingFund = ({ show, onHide, onCreated }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  const [beginningAmount, setBeginningAmount] = useState("");
  const [addedAmount, setAddedAmount] = useState("");

  const [budgetOptions, setBudgetOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [bankError, setBankError] = useState(null);

  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);

  // UTILITIES
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

  // FETCH BUDGETS
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true);
      try {
        const response = await fetch("/api/budget/getbudget");
        if (!response.ok) throw new Error("Failed to fetch budget list");

        const result = await response.json();
        const options = result.data.map((b) => ({
          value: b.id,
          label: b.budget_name || b.code || b.department,
          beginningAmount: b.beginning_amount || b.amount || 0,
        }));

        setBudgetOptions(options);
      } catch (error) {
        console.error("Budget fetch error:", error);
      } finally {
        setLoadingBudgets(false);
      }
    };

    fetchBudgets();
  }, []);

  // FETCH BANK ACCOUNTS
  useEffect(() => {
    const fetchBankAccounts = async () => {
      setLoadingBankAccounts(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("/api/bank_accounts/activebank_accounts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.clear();
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch bank accounts");

        const result = await res.json();
        const options = result.data.map((b) => ({
          value: b.mba_id,
          label: `${b.mba_bank_type} - ${b.mba_account_name}`,
        }));

        setBankOptions(options);
      } catch (error) {
        console.error("Bank Fetch Error:", error);
        setBankError(error.message);
      } finally {
        setLoadingBankAccounts(false);
      }
    };

    fetchBankAccounts();
  }, []);

  // HANDLERS
  const handleSelectBudget = (selected) => {
    setSelectedBudget(selected);
    setBeginningAmount(formatCurrency(selected.beginningAmount));
  };

  const handleClose = () => {
    setSelectedBudget(null);
    setSelectedBankAccount(null);
    setBeginningAmount("");
    setAddedAmount("");
    setBankError(null);
    onHide();
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      if (!selectedBudget) {
        console.warn("No budget selected.");
        return;
      }

      const beginning = sanitizeAmount(beginningAmount);
      const added = parseFloat(addedAmount || "0");

      const payload = {
        budget_id: selectedBudget.value,
        beginning,
        added,
        ...(selectedBankAccount?.value && {
          bank_account_id: selectedBankAccount.value,
        }),
      };

      console.log("Submitting Payload:", payload);

      const res = await fetch("/api/revolving_fund/createrevolving_fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Create Response:", result);

      if (!res.ok || result.message !== "SUCCESS") {
        throw new Error(result?.message || "Failed to create fund.");
      }

      onCreated?.();
      handleClose();
    } catch (error) {
      console.error("Submit Error:", error);
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
                Select Budget ID
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
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Beginning Amount
              </Form.Label>
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
                isLoading={loadingBankAccounts}
                value={selectedBankAccount}
                onChange={setSelectedBankAccount}
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
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Added Amount
              </Form.Label>
              <Form.Control
                type="number"
                value={addedAmount}
                onChange={(e) => setAddedAmount(e.target.value)}
                onKeyDown={preventInvalidKeys}
                min="0"
                style={{ fontSize: "0.75rem", height: "38px" }}
              />
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

export default NewRevolvingFund;
