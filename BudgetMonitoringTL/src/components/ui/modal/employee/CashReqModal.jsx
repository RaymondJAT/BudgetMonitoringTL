import { useState, useCallback } from "react";
import { Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CashReqForm from "../../../layout/employee/cash-request/CashReqForm";
import AppButton from "../../buttons/AppButton";

const CashReqModal = ({ show, onHide, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCloseModal = () => {
    if (!submitting) {
      setFormOutput({});
      onHide();
    }
  };

  // Memoized callback to prevent infinite loop
  const handleFormChange = useCallback((data) => {
    setFormOutput(data);
  }, []);

  const handleSave = async () => {
    if (!formOutput || Object.keys(formOutput).length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields before submitting.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Expired",
        text: "Please log in again to continue.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    try {
      setSubmitting(true);

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

      // ✅ Auto-close success Swal without confirm button
      Swal.fire({
        icon: "success",
        title: "Cash Request Submitted",
        text: "Your cash request has been successfully submitted.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting cash request:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong. Please try again.",
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
        <CashReqForm data={{}} onChange={handleFormChange} />
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
