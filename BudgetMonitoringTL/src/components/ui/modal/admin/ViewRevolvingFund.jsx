import { useState, useEffect } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import AppButton from "../../AppButton";
import AllocationTable from "../../../layout/AllocationTable";

const ViewRevolvingFund = ({ show, onHide, budgetId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 50;
  const offset = 10;

  useEffect(() => {
    if (!show || !budgetId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/cash_disbursement/getcash_disbursement/${budgetId}/${limit}/${offset}`,
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

        setTransactions(Array.isArray(json.data) ? json.data : []);
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
          <AllocationTable transactions={transactions} height="500px" />
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
