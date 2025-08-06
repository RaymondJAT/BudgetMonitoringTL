import { useState, useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const NewRevolvingFund = ({ show, onHide }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  const [amount, setAmount] = useState("");
  const [beginningAmount, setBeginningAmount] = useState("");
  const [addedAmount, setAddedAmount] = useState("");

  const [budgetOptions, setBudgetOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budget/getbudget");

        if (!response.ok) {
          throw new Error("Failed to fetch budget list");
        }

        const result = await response.json();

        const formatted = result.data.map((budget) => ({
          value: budget.id,
          label: budget.budget_name || budget.code || `${budget.department}`,
          beginningAmount: budget.beginning_amount || `${budget.amount}`,
        }));

        setBudgetOptions(formatted);
      } catch (error) {
        console.error("Budget fetch error:", error);
      }
    };

    const fetchBankAccounts = async () => {
      try {
        const response = await fetch("/api/bank_accounts/activebank_accounts");

        if (!response.ok) {
          throw new Error("Failed to fetch bank accounts");
        }

        const result = await response.json();

        const formatted = result.data.map((bank) => ({
          value: bank.id,
          label:
            bank.account_name ||
            bank.bank_name ||
            `${bank.mba_bank_type} - ${bank.mba_account_name}`,
        }));

        setBankOptions(formatted);
      } catch (error) {
        console.error("Bank fetch error:", error);
      }
    };

    fetchBudgets();
    fetchBankAccounts();
  }, []);

  const handleClose = () => {
    setSelectedBudget(null);
    setAmount("");
    setBeginningAmount("");
    setSelectedBankAccount(null);
    setAddedAmount("");
    onHide();
  };

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handleSelectBudget = (selected) => {
    setSelectedBudget(selected);

    const formattedAmount = `₱ ${Number(
      selected.beginningAmount
    ).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    setBeginningAmount(formattedAmount);
  };

  const handleSubmit = () => {
    console.log("Budget:", selectedBudget);
    console.log("Beginning Amount:", beginningAmount);
    console.log("Added Amount:", addedAmount);
    console.log("Amount:", amount);
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
                value={selectedBudget}
                onChange={handleSelectBudget}
                styles={customStyles}
                placeholder="Select..."
                options={budgetOptions}
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
                style={{
                  fontSize: "0.75rem",
                  height: "38px",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #ced4da",
                }}
              />
            </Col>
          </Row>

          <Row className="mb-2 g-2">
            <Col md={8}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Bank Account
              </Form.Label>
              <Select
                value={selectedBankAccount}
                onChange={setSelectedBankAccount}
                styles={customStyles}
                placeholder="Select..."
                options={bankOptions}
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
                style={{
                  fontSize: "0.75rem",
                  height: "38px",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #ced4da",
                }}
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
          label="Submit"
          variant="outline-success"
          onClick={handleSubmit}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewRevolvingFund;
