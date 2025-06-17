import { useState } from "react";
import { Modal } from "react-bootstrap";
import LiqReqForm from "../../layout/employee/LiqReqForm";
import AppButton from "../AppButton";

const LiqFormModal = ({ show, onHide }) => {
  const [showCashReqModal, setShowLiqFormModal] = useState(false);
  const handleCloseModal = () => setShowLiqFormModal(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-xl"
      centered
      scrollable
    >
      <Modal.Header style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Liquidation Form
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <LiqReqForm />
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={handleCloseModal}
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

export default LiqFormModal;
