import { Modal } from "react-bootstrap";
import CashReqForm from "../../../layout/employee/cash-request/CashReqForm";
import AppButton from "../../AppButton";

const CashReqModal = ({ show, onHide }) => {
  const handleCloseModal = () => {
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
        <CashReqForm data={{}} signatures={{}} particulars={{}} />
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

export default CashReqModal;
