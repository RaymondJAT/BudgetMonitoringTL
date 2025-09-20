import { useState, useEffect } from "react";
import { Modal, InputGroup, FormControl, Form } from "react-bootstrap";
import Select from "react-select";
import AppButton from "../../buttons/AppButton";
import { customStyles } from "../../../../constants/customStyles";

const SubmitCashDisbursement = ({ show, onHide, disbursement }) => {
  const [fundOptions, setFundOptions] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [amountExpended, setAmountExpended] = useState("");

  const formatCurrency = (val) =>
    `₱ ${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Auto compute amount return
  const issuedAmount = disbursement?.amount_issue || 0;
  const expended = parseFloat(amountExpended || 0);
  const amountReturn = issuedAmount - expended;

  // Fetch revolving funds
  useEffect(() => {
    const fetchFunds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }
      try {
        const res = await fetch(
          "/api5001/revolving_fund/getrevolving_fund_currently",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch funds");

        const json = await res.json();
        const options = (json.data || []).map((fund) => ({
          value: fund.id,
          label: fund.name,
        }));

        setFundOptions(options);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };

    fetchFunds();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      let amountReturnVal = 0;
      let amountReimburseVal = 0;

      if (expended < issuedAmount) {
        amountReturnVal = issuedAmount - expended;
      } else if (expended > issuedAmount) {
        amountReimburseVal = expended - issuedAmount;
      }

      const payload = {
        id: disbursement?.id,
        rf_id: selectedFund?.value || disbursement?.revolving_fund_id,
        amount_expended: expended,
        amount_return: amountReturnVal,
        amount_reimburse: amountReimburseVal,
        cash_voucher: disbursement?.cash_voucher,
      };

      const res = await fetch(
        "/api5001/cash_disbursement/updatecash_disbursement",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update cash disbursement");

      const data = await res.json();
      console.log("Cash disbursement updated:", data);

      onHide();

      window.location.reload();
    } catch (err) {
      console.error("Error updating disbursement:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      scrollable
      centered
      dialogClassName="modal-md"
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "3px" }}
        >
          Submit Cash Disbursement
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {/* CASH DISBURSEMENT DETAILS */}
        <div className="custom-container border rounded p-3 shadow-sm mb-2">
          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Cash Voucher
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={disbursement?.cash_voucher || ""}
              className="small-input"
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Cash Disbursement ID
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={disbursement?.id || ""}
              className="small-input"
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Amount Issued
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={formatCurrency(disbursement?.amount_issue)}
              className="small-input"
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Outstanding Amount
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={formatCurrency(disbursement?.outstanding_amount)}
              className="small-input"
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Revolving Fund Label
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={disbursement?.revolving_fund_label || ""}
              className="small-input"
            />
          </InputGroup>

          <InputGroup>
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Revolving Fund ID
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={disbursement?.revolving_fund_id || ""}
              className="small-input"
            />
          </InputGroup>
        </div>

        {/* Select Revolving Fund */}
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: "0.75rem", color: "#fff" }}>
            Select Revolving Fund
          </Form.Label>
          <Select
            options={fundOptions}
            value={selectedFund}
            onChange={setSelectedFund}
            placeholder="Choose Fund"
            styles={customStyles}
            isClearable
          />
        </Form.Group>

        {/* Editable Inputs */}
        <div className="custom-container border rounded p-3 shadow-sm">
          <InputGroup className="mb-2">
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              Amount Expended
            </InputGroup.Text>
            <FormControl
              type="text"
              placeholder="0.00"
              value={amountExpended}
              onChange={(e) =>
                setAmountExpended(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="small-input"
            />
          </InputGroup>

          <InputGroup>
            <InputGroup.Text className="small-input fw-semibold fixed-label">
              {expended < issuedAmount
                ? "Amount Return"
                : expended > issuedAmount
                ? "Amount Reimburse"
                : "Fully Expended"}
            </InputGroup.Text>
            <FormControl
              type="text"
              readOnly
              value={
                expended === issuedAmount
                  ? formatCurrency(0)
                  : formatCurrency(Math.abs(amountReturn))
              }
              className="small-input"
            />
          </InputGroup>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={onHide}
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

export default SubmitCashDisbursement;
