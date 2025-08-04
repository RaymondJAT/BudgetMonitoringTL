import { useEffect, useMemo, useState } from "react";
import { Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Select from "react-select";
import AppButton from "../../AppButton";
import useFetch from "../../../../hooks/useFetch";

import { departments, types } from "../../../../constants/departmentModal";
import { customStyles } from "../../../../constants/customStyles";

const NewBudgetAllocation = ({ show, onHide, onSubmit }) => {
  const [bank, setBank] = useState(null);
  const [department, setDepartment] = useState(null);
  const [type, setType] = useState(null);
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  // 🔽 Fetch bank accounts from API
  const {
    data: bankData,
    loading: loadingBankAccounts,
    error: bankError,
  } = useFetch("/api/bank_accounts/getbank_accounts", { method: "GET" });

  // 🔁 Form options
  const departmentOptions = useMemo(
    () => departments.map((dept) => ({ value: dept, label: dept })),
    []
  );

  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t, label: t })),
    []
  );

  const bankOptions = useMemo(() => {
    if (!bankData?.data || !Array.isArray(bankData.data)) return [];

    return bankData.data
      .filter((item) => item.status === "active")
      .map((bank) => ({
        value: bank.id,
        label: `${bank.bank_type} - ${bank.account_name} (${bank.account_number})`,
      }));
  }, [bankData]);

  console.log("Fetched bank accounts:", bankData);
  console.log("error", bankError);

  const handleClose = () => {
    setBank(null);
    setDepartment(null);
    setType(null);
    setBudget("");
    setDescription("");
    onHide();
  };

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v")) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      e.target.value = "0";
    }
    setBudget(e.target.value);
  };

  const { loading, triggerFetch } = useFetch("/api/budget/createbudget", {
    method: "POST",
    triggerFetch: false,
  });

  const handleSubmit = async () => {
    const payload = {
      bankAccount: bank?.value,
      department: department?.value,
      type: type?.value,
      budget: parseFloat(budget),
      description,
    };

    const res = await triggerFetch(payload);

    if (!res.error) {
      const newItem = {
        id: Date.now(),
        bank: bank?.label,
        department: department?.label,
        type: type?.label,
        allocated: parseFloat(budget),
        used: 0,
        description,
      };

      if (onSubmit) onSubmit(newItem);
      handleClose();
    } else {
      console.error(res.error);
    }
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
          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "0.75rem" }}>
                Select Bank Account
              </Form.Label>
              <Select
                isLoading={loadingBankAccounts}
                value={bank}
                onChange={setBank}
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
            </Col>
          </Row>

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
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={handleClose}
          className="custom-app-button"
        />
        <AppButton
          label={loading ? "Saving..." : "Confirm"}
          variant="outline-success"
          onClick={handleSubmit}
          className="custom-app-button"
          disabled={loading}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewBudgetAllocation;
