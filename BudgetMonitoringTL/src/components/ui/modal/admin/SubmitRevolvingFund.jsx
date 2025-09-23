import { useState, useEffect } from "react";
import { Modal, Spinner, InputGroup, FormControl } from "react-bootstrap";
import { columns } from "../../../../constants/BudgetingColumn";
import DataTable from "../../../layout/DataTable";
import AppButton from "../../buttons/AppButton";

const SubmitRevolvingFund = ({ show, onHide, fundData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState(null);
  const [amount, setAmount] = useState("");
  const [focused, setFocused] = useState(false);
  const [budgetType, setBudgetType] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!show || !fundData?.id) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api5001/revolving_fund/generaterevolving-fund/${fundData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        setTransactions(data.cash_disbursement || []);
        setSummary(data.total?.[0] || null);
        setBudgetType(data.type?.[0]?.budget_type || "CASH");
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [show, fundData?.id, token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const numAmount = parseFloat(amount) || 0;

      const payload = {
        id: fundData.id,
        beginning: summary?.beginning_amount || 0,
        cash_inflows: summary?.total_amount_return || 0,
        cash_outflows: summary?.total_amount_expended || 0,
        ending: summary?.ending_amount || 0,
        cash_on_hand: budgetType === "CASH" ? numAmount : 0,
        gcash: budgetType === "GCASH" ? numAmount : 0,
      };

      payload.total_cash = payload.cash_on_hand + payload.gcash;
      payload.sub_total = (summary?.ending_amount || 0) - payload.total_cash;

      if (numAmount === (summary?.ending_amount || 0)) {
        payload.status = "BALANCED";
      } else if (numAmount > (summary?.ending_amount || 0)) {
        payload.status = "OVER";
      } else {
        payload.status = "SHORT";
      }

      const res = await fetch("/api5001/revolving_fund/close-revolving-fund", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();

      setReport(data);
      onHide();

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to close revolving fund:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    `₱ ${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // FORMAT NUMBER AS PESO WITH 2 DECIMALS
  const formatPeso = (val) => {
    if (val === "" || val == null || isNaN(val)) return "";
    return (
      "₱" +
      Number(val).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  // COMPUTE STATUS
  const computeStatus = () => {
    const ending = summary?.ending_amount || 0;
    const amt = parseFloat(amount) || 0;
    if (amt === ending) return "BALANCED";
    if (amt > ending) return "OVER";
    return "SHORT";
  };

  const computedStatus = computeStatus();

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-xl"
      centered
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Submit Revolving Fund
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="light" />
            <div className="mt-2 text-light">Loading Transactions...</div>
          </div>
        )}

        <div className="row g-3">
          {/* Left Column */}
          <div className="col-lg-8">
            <DataTable
              data={transactions}
              columns={columns}
              height="430px"
              showCheckbox={false}
              showActions={false}
            />
          </div>

          {/* Right Column */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            {/* Summary */}
            <div className="custom-container border rounded p-3 shadow-sm">
              <h6 className="fw-bold mb-3">Summary</h6>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  Beginning Amount
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatCurrency(summary?.beginning_amount)}
                  className="small-input"
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  Added Amount
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatCurrency(summary?.added_amount)}
                  className="small-input"
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  Total Amount Return
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatCurrency(summary?.total_amount_return)}
                  className="small-input"
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  Total Amount Expended
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatCurrency(summary?.total_amount_expended)}
                  className="small-input"
                />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  Ending Amount
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatCurrency(summary?.ending_amount)}
                  className="small-input"
                />
              </InputGroup>
            </div>

            <div className="custom-container border rounded p-3 shadow-sm flex-fill">
              <h6 className="fw-bold mb-3">Cash Report</h6>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  {budgetType}
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="₱0.00"
                  value={
                    focused
                      ? amount ?? ""
                      : amount != null && amount !== ""
                      ? formatPeso(amount)
                      : ""
                  }
                  onChange={(e) => {
                    let raw = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = raw.split(".");
                    if (parts.length > 2) raw = parts[0] + "." + parts[1];
                    setAmount(raw === "" ? "" : raw);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    if (amount !== "" && !isNaN(amount)) {
                      setAmount(parseFloat(amount));
                    }
                    setFocused(false);
                  }}
                  className="small-input"
                />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text
                  className={`small-input fw-semibold fixed-label ${
                    computedStatus === "OVER"
                      ? "text-danger"
                      : computedStatus === "BALANCED"
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {computedStatus}
                </InputGroup.Text>
                <FormControl
                  type="text"
                  readOnly
                  value={formatPeso(summary?.ending_amount)}
                  className="small-input"
                />
              </InputGroup>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
        <AppButton
          label="Submit"
          variant="outline-success"
          onClick={handleSubmit}
          disabled={loading}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default SubmitRevolvingFund;
