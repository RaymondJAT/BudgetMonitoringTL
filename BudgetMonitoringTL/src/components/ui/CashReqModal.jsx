import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CashReqForm from "../../pages/employee/CashReqForm";

const CashReqModal = ({ data, signatures, particulars }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Open Cash Request Form
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Cash Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CashReqForm
            data={data}
            signatures={signatures}
            particulars={particulars}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* You can add Save/Submit button here */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CashReqModal;
