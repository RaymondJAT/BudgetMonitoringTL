import { useState, useCallback } from "react";
import { Modal, Alert, Spinner } from "react-bootstrap";
import CashReqForm from "../../../layout/employee/cash-request/CashReqForm";
import AppButton from "../../AppButton";

const CashReqModal = ({ show, onHide, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCloseModal = () => {
    if (!submitting) {
      setFormOutput({});
      setError("");
      onHide();
    }
  };

  // Memoized callback to prevent infinite loop
  const handleFormChange = useCallback((data) => {
    setFormOutput(data);
  }, []);

  const handleSave = async () => {
    if (!formOutput || Object.keys(formOutput).length === 0) {
      console.warn("No form data to submit.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication expired. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api5012/cash_request/createcash_request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formOutput),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }

      const result = await res.json();
      if (onSubmit) onSubmit(result.data || formOutput);

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting cash request:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="modal-lg"
      centered
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "3px" }}
        >
          Cash Request Form
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {error && (
          <Alert
            variant="danger"
            className="mb-3"
            onClose={() => setError("")}
            dismissible
          >
            {error}
          </Alert>
        )}

        <CashReqForm
          data={{}}
          onChange={handleFormChange} // use memoized callback
        />
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={handleCloseModal}
          className="custom-app-button"
          disabled={submitting}
        />
        <AppButton
          label={
            submitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )
          }
          variant="outline-success"
          className="custom-app-button"
          onClick={handleSave}
          disabled={submitting}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CashReqModal;
