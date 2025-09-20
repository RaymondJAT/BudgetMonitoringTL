import { useState } from "react";
import { Modal } from "react-bootstrap";

const LiquidationReceipt = ({ images = [], remarks = "" }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const handleImageClick = (src) => {
    setModalImage(src);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setModalImage("");
    setShowModal(false);
  };

  return (
    <div className="custom-container border mb-3 p-3 rounded">
      <p className="fw-bold mb-2">Proof of Liquidation</p>

      {/* REMARKS */}

      {remarks ? (
        <p className="mb-3">
          <strong>Remarks:</strong> {remarks}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div
          className="d-flex flex-nowrap gap-2"
          style={{
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="position-relative"
              style={{ display: "inline-block", flex: "0 0 auto" }}
            >
              <img
                src={src}
                alt={`Proof ${index + 1}`}
                onClick={() => handleImageClick(src)}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "contain",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "2px",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No receipts provided.</p>
      )}

      {/* PREVIEW */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="text-center p-3">
          {modalImage && (
            <img
              src={modalImage}
              alt="Full preview"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LiquidationReceipt;
