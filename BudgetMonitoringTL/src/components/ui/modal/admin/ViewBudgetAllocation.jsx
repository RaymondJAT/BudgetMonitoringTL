import { useState, useEffect } from "react";
import { Modal, Spinner, Alert, Row, Col, Container } from "react-bootstrap";
import AppButton from "../../AppButton";
import ToolBar from "../../../layout/ToolBar";
import DataTable from "../../../layout/DataTable";
import { allocationColumns } from "../../../../constants/historyColumn";

// NORMALIZATION FUNCTION
const normalizeTransaction = (item) => ({
  id: item.id ?? item.ID ?? "—",
  date_issue: item.date_issue ?? item.dateIssued ?? "—",
  cash_voucher: item.cash_voucher ?? item.cashVoucher ?? "—",
  received_by: item.received_by ?? item.receiver ?? "—",
  description: item.description ?? item.department ?? "—",
  particulars: item.particulars ?? "—",
  amount_issue: Number(item.amount_issue ?? item.amountIssued ?? 0),
  amount_return: Number(item.amount_return ?? 0),
  amount_expend: Number(item.amount_expend ?? 0),
  outstanding_amount: Number(item.outstanding_amount ?? 0),
  status: item.status ?? "—",
  date_liquidated: item.date_liquidated ?? item.dateLiquidated ?? "-",
});

const ViewBudgetAllocation = ({ show, onHide, rf_id }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalsData, setTotalsData] = useState([]);
  const [budgetItem, setBudgetItem] = useState(null);

  const limit = 100;
  const offset = 0;

  useEffect(() => {
    if (!show || !rf_id) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api5001/cash_disbursement/getcash_disbursement/${rf_id}/${limit}/${offset}`,
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

        if (normalized.length > 0) {
          setBudgetItem({
            department: normalized[0].description || "Revolving Fund",
          });

          const totalIssued = normalized.reduce(
            (sum, t) => sum + t.amount_issue,
            0
          );
          const totalReturned = normalized.reduce(
            (sum, t) => sum + t.amount_return,
            0
          );

          setTotalsData([
            {
              totalBudget: totalIssued,
              budgetUsed: totalIssued - totalReturned,
              remainingBudget: totalReturned,
            },
          ]);
        } else {
          setBudgetItem(null);
          setTotalsData([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setTransactions([]);
        setTotalsData([]);
        setBudgetItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [show, rf_id]);

  if (!show) return null;

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
          {budgetItem?.department || "Revolving Fund"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ backgroundColor: "#800000" }}
        className="cashreq-scroll text-white"
      >
        <Container fluid>
          <Row>
            <Col>
              <div className="custom-container flex-grow-1 p-3 rounded shadow-sm d-flex flex-column">
                <ToolBar
                  searchValue=""
                  onSearchChange={() => {}}
                  leftContent={
                    <span
                      className="fw-bold"
                      style={{ fontSize: "0.75rem", color: "black" }}
                    >
                      Budget Overview
                    </span>
                  }
                  showFilter={false}
                />

                {loading && (
                  <div className="text-center mt-2">
                    <Spinner animation="border" variant="dark" />
                    <div className="mt-2 text-dark">Loading data...</div>
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
                    columns={allocationColumns}
                    selectedRows={{}}
                    onSelectionChange={() => {}}
                    showCheckbox={false}
                    showActions={false}
                    height="260px"
                  />
                )}
              </div>
            </Col>
          </Row>
        </Container>
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

export default ViewBudgetAllocation;
