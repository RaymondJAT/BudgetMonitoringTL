import { useState, useEffect } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";
import DataTable from "../../../layout/DataTable";
import { viewFunds } from "../../../../constants/BudgetingColumn";

// 🔹 Peso formatter
const formatPeso = (value) => {
  if (value === "" || value == null || isNaN(value)) return "₱0.00";
  return (
    "₱" +
    Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

const normalizeTransaction = (item) => ({
  id: item.id ?? item.ID ?? "—",
  date_issue: item.date_issue ?? item.dateIssued ?? "—",
  received_by: item.received_by ?? item.receiver ?? "—",
  description: item.description ?? "—",
  particulars: item.particulars ?? "—",
  amount_issue: formatPeso(item.amount_issue ?? item.amountIssued ?? 0),
  amount_return: formatPeso(item.amount_return ?? 0),
  amount_expend: formatPeso(item.amount_expend ?? 0),
  outstanding_amount: formatPeso(item.outstanding_amount ?? 0),
  cash_voucher: item.cash_voucher ?? item.cashVoucher ?? "—",
  status: item.status ?? "—",
  date_liquidated: item.date_liquidated ?? item.dateLiquidated ?? "-",
});

const ViewRevolvingFund = ({ show, onHide, budgetId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 100;
  const offset = 0;

  useEffect(() => {
    if (!show || !budgetId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api5001/cash_disbursement/getcash_disbursement/${budgetId}/${limit}/${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok)
          throw new Error(`Failed to fetch transactions (${res.status})`);

        const json = await res.json();
        const normalized = (Array.isArray(json.data) ? json.data : []).map(
          normalizeTransaction
        );

        setTransactions(normalized);
      } catch (err) {
        setError(err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [show, budgetId]);

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
          Revolving Fund
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="light" />
            <div className="mt-2 text-light">Loading transactions...</div>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <DataTable
            data={transactions}
            columns={viewFunds}
            showCheckbox={false}
            showActions={false}
            height="425px"
          />
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ViewRevolvingFund;
