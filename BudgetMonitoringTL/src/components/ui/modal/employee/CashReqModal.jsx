import { useState } from "react";
import { Modal } from "react-bootstrap";
import CashReqForm from "../../../layout/employee/cash-request/CashReqForm";
import AppButton from "../../AppButton";

const CashReqModal = ({ show, onHide, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCloseModal = () => {
    onHide();
  };

  const handleSave = async () => {
    if (!formOutput || Object.keys(formOutput).length === 0) {
      console.warn("No form data to submit.");
      return;
    }

    const newEntry = {
      ...formOutput,
      createdAt: new Date().toISOString(),
      formType: "Cash Request",
      status: "Pending",
      transactions: formOutput.particulars || [],
    };

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api5001/cash-request/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const result = await res.json();

      if (onSubmit) onSubmit(result.data || newEntry);

      onHide();
    } catch (error) {
      console.error("Error submitting cash request:", error);
    } finally {
      setSubmitting(false);
    }
  };

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
          style={{ letterSpacing: "3px" }}
        >
          Cash Request Form
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        <CashReqForm
          data={{}}
          signatures={{}}
          particulars={[]}
          onChange={(data) => setFormOutput(data)}
        />
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={handleCloseModal}
          className="custom-app-button"
        />
        <AppButton
          label={submitting ? "Submitting..." : "Submit"}
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
