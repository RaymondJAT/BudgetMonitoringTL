import { useState } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LiqReqForm from "../../../layout/employee/liquidation-request/LiqReqForm";
import AppButton from "../../buttons/AppButton";

const LiqFormModal = ({ show, onHide, requestData = null, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    if (!submitting) onHide();
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting liquidation payload:", formData);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api5012/liquidation/create_liquidation", {
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

      if (onSuccess && result?.id) {
        onSuccess(result);
      }

      // ✅ SUCCESS SWAL (auto-close, no confirm button)
      Swal.fire({
        icon: "success",
        title: "Liquidation Submitted",
        text: "Your liquidation form has been successfully submitted.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      onHide();
      navigate("/employee_liquidation");
    } catch (err) {
      console.error("Error submitting liquidation:", err);
      setError(err.message);

      // ❌ ERROR SWAL
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#800000",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="modal-fullscreen"
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
        <LiqReqForm requestData={requestData} onSubmit={handleSubmit} />
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
          disabled={submitting}
          className="custom-app-button"
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
          onClick={() =>
            document.getElementById("liq-req-form")?.requestSubmit()
          }
          disabled={submitting}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default LiqFormModal;
