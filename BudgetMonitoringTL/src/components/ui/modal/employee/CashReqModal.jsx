import { useState } from "react";
import { Modal } from "react-bootstrap";
import { LOCAL_KEYS } from "../../../../constants/localKeys";
import CashReqForm from "../../../layout/employee/cash-request/CashReqForm";
import AppButton from "../../AppButton";

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const CashReqModal = ({ show, onHide, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});

  const handleCloseModal = () => {
    onHide();
  };

  const handleSave = () => {
    const newEntry = {
      ...formOutput,
      createdAt: new Date().toISOString(),
      id: generateId(),
      formType: "Cash Request",
      status: "Pending",
      transactions: formOutput.particulars,
    };

    const existingData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
    const updatedData = [...existingData, newEntry];
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updatedData));

    if (onSubmit) onSubmit(updatedData);

    onHide();
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
          label="Submit"
          variant="outline-success"
          className="custom-app-button"
          onClick={handleSave}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CashReqModal;
