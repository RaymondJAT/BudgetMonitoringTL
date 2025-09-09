import { useState } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import LiqReqForm from "../../../layout/employee/liquidation-request/LiqReqForm";
import AppButton from "../../AppButton";

const LiqFormModal = ({ show, onHide }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCloseModal = () => {
    if (!submitting) onHide();
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api5012/route_access/createroute_access", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to submit liquidation form");
      }

      const result = await response.json();
      console.log("Liquidation submitted:", result);

      onHide();
    } catch (err) {
      console.error("Error submitting liquidation:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="modal-xl"
      centered
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Liquidation Form
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {/* Pass submit handler down */}
        <LiqReqForm onSubmit={handleSubmit} />
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
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
                <Spinner size="sm" animation="border" /> Submitting...
              </>
            ) : (
              "Submit"
            )
          }
          variant="outline-success"
          className="custom-app-button"
          onClick={() => {
            // trigger LiqReqForm submission manually
            const form = document.getElementById("liq-req-form");
            if (form) form.requestSubmit();
          }}
          disabled={submitting}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default LiqFormModal;
