import { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";

import { columns } from "../../../../constants/BudgetingColumn";
import DataTable from "../../../layout/DataTable";
import AppButton from "../../AppButton";

const SubmitRevolvingFund = ({ show, onHide, fundData }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!show || !fundData?.id) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/revolving_fund/generaterevolving-fund/${fundData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        // Set table data
        setTransactions(data.cash_disbursement || []);

        // Set summary data
        if (Array.isArray(data.total) && data.total.length > 0) {
          setSummary(data.total[0]);
        } else {
          setSummary(null);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [show, fundData?.id, token]);

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

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="light" />
            <div className="mt-2 text-light">Loading Transactions...</div>
          </div>
        )}

        <div className="row g-3">
          {/* Left Column */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            <div className="custom-container border rounded p-3 shadow-sm">
              {/* SUMMARY */}
              <h6 className="fw-bold mb-2">Summary</h6>
              <div className="mb-1">
                Beginning Amount: ₱
                {summary?.beginning_amount?.toLocaleString() || 0}
              </div>
              <div className="mb-1">
                Added Amount: ₱{summary?.added_amount?.toLocaleString() || 0}
              </div>
              <div className="mb-1">
                Total Amount Return: ₱
                {summary?.total_amount_return?.toLocaleString() || 0}
              </div>
              <div className="mb-1">
                Total Amount Expended: ₱
                {summary?.total_amount_expended?.toLocaleString() || 0}
              </div>
              <div className="mb-1">
                Ending Amount: ₱{summary?.ending_amount?.toLocaleString() || 0}
              </div>
            </div>

            <div className="custom-container border rounded p-3 shadow-sm flex-fill">
              {/* CASH REPORT */}
              <h6 className="fw-bold mb-2">Cash Report</h6>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-8">
            <DataTable
              data={transactions}
              columns={columns}
              height="400px"
              showCheckbox={false}
              showActions={false}
            />
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
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default SubmitRevolvingFund;
