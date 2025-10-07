import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Spinner, InputGroup, FormControl } from "react-bootstrap";
import { columns } from "../../../../constants/BudgetingColumn";
import DataTable from "../../../layout/DataTable";
import AppButton from "../../buttons/AppButton";

const SubmitRevolvingFund = ({ show, onHide, fundData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [amount, setAmount] = useState("");
  const [focused, setFocused] = useState(false);
  const [budgetType, setBudgetType] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const revolvingFundId = fundData?.revolving_fund_id || fundData?.id;
  const token = localStorage.getItem("token");

  const formatCurrency = (val) =>
    `₱ ${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

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

  const computeStatus = useCallback(() => {
    const ending = summary?.ending_amount || 0;
    const amt = parseFloat(amount) || 0;
    if (amt === ending) return "BALANCED";
    if (amt > ending) return "OVER";
    return "SHORT";
  }, [amount, summary]);

  const isFundClosed = useMemo(() => {
    return ["CLOSED", "BALANCED", "OVER", "SHORT"].includes(fundData?.status);
  }, [fundData?.status]);

  const isEditable = !hasSubmitted && !isFundClosed;

  // API CALLS
  const fetchTransactions = useCallback(async () => {
    if (!revolvingFundId || !token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api5001/revolving_fund/generaterevolving-fund/${revolvingFundId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();

      setTransactions(data.cash_disbursement || []);
      setSummary(data.total?.[0] || null);
      setBudgetType(data.type?.[0]?.budget_type || "CASH");

      if (isFundClosed) {
        await fetchClosedFund();
      } else {
        setAmount("");
        setHasSubmitted(false);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [revolvingFundId, token, isFundClosed]);

  const fetchClosedFund = async () => {
    try {
      const res = await fetch(
        `/api5001/revolving_fund/get_closed_revolving_fund?id=${revolvingFundId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        const closedData = await res.json();
        const closedAmount = closedData?.data?.[0]?.closed_amount || "";
        setAmount(closedAmount.toString());
      } else {
        console.error("Failed to fetch closed fund");
        setAmount("");
      }
    } catch (err) {
      console.error("Closed fund fetch error:", err);
      setAmount("");
    } finally {
      setHasSubmitted(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setHasSubmitted(true);

      const numAmount = parseFloat(amount) || 0;
      const ending = summary?.ending_amount || 0;

      const payload = {
        id: revolvingFundId,
        beginning: summary?.beginning_amount || 0,
        cash_inflows: summary?.total_amount_return || 0,
        cash_outflows: summary?.total_amount_expended || 0,
        ending,
        cash_on_hand: budgetType === "CASH" ? numAmount : 0,
        gcash: budgetType === "GCASH" ? numAmount : 0,
      };

      payload.total_cash = payload.cash_on_hand + payload.gcash;
      payload.sub_total = ending - payload.total_cash;

      payload.status =
        numAmount === ending
          ? "BALANCED"
          : numAmount > ending
          ? "OVER"
          : "SHORT";

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

      if (data?.closed_amount) {
        setAmount(data.closed_amount.toString());
      }

      const updatedFund = {
        ...fundData,
        cash_on_hand: payload.cash_on_hand,
        gcash: payload.gcash,
        status: data.status ?? fundData.status,
      };

      if (typeof onSuccess === "function") onSuccess(updatedFund);
      onHide();
    } catch (err) {
      console.error("Failed to close revolving fund:", err);
      setHasSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchTransactions();
  }, [show, fetchTransactions]);

  // RENDER
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
          {/* LEFT */}
          <div className="col-lg-8">
            <DataTable
              data={transactions}
              columns={columns}
              height="430px"
              showCheckbox={false}
              showActions={false}
            />
          </div>

          {/* RIGHT */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            {/* SUMMARY */}
            <div className="custom-container border rounded p-3 shadow-sm">
              <h6 className="fw-bold mb-3">Summary</h6>
              {[
                ["Beginning Amount", summary?.beginning_amount],
                ["Added Amount", summary?.added_amount],
                ["Total Amount Return", summary?.total_amount_return],
                ["Total Amount Expended", summary?.total_amount_expended],
                ["Ending Amount", summary?.ending_amount],
              ].map(([label, value], idx) => (
                <InputGroup className="mb-2" key={idx}>
                  <InputGroup.Text className="small-input fw-semibold fixed-label">
                    {label}
                  </InputGroup.Text>
                  <FormControl
                    type="text"
                    readOnly
                    value={formatCurrency(value)}
                    className="small-input"
                  />
                </InputGroup>
              ))}
            </div>

            {/* CASH REPORT */}
            <div className="custom-container border rounded p-3 shadow-sm flex-fill">
              <h6 className="fw-bold mb-3">Cash Report</h6>

              <InputGroup className="mb-2">
                <InputGroup.Text className="small-input fw-semibold fixed-label">
                  {budgetType}
                </InputGroup.Text>

                {isEditable ? (
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
                ) : (
                  <FormControl
                    type="text"
                    readOnly
                    value={formatPeso(amount)}
                    className="small-input"
                  />
                )}
              </InputGroup>

              <InputGroup>
                <InputGroup.Text
                  className={`small-input fw-semibold fixed-label ${
                    computeStatus() === "OVER"
                      ? "text-danger"
                      : computeStatus() === "BALANCED"
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {computeStatus()}
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
        {isEditable && (
          <AppButton
            label="Submit"
            variant="outline-success"
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="custom-app-button"
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SubmitRevolvingFund;
