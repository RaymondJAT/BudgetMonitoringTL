import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "../AppButton";

const LiquidReceipt = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    const newPreviews = validImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...validImages]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageClick = (src) => {
    setModalImage(src);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  const handleClearImages = () => {
    setImages([]);
    setPreviews([]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="request-container border p-3 mt-3">
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label className="fw-bold">Upload Liquidation Receipts</Form.Label>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="small-input w-25"
          />
          <AppButton
            label="Clear All"
            variant="outline-danger"
            size="sm"
            onClick={handleClearImages}
            disabled={previews.length === 0}
            className="custom-app-button"
          />
        </div>
      </Form.Group>

      {previews.length > 0 && (
        <div className="mt-3">
          <div
            className="d-flex flex-nowrap gap-3"
            style={{
              overflowX: "auto",
              paddingBottom: "8px",
              cursor: "pointer",
            }}
          >
            {previews.map((preview, index) => (
              <div
                key={index}
                className="position-relative"
                style={{ display: "inline-block" }}
              >
                <img
                  src={preview.url}
                  alt={`Receipt ${index + 1}`}
                  onClick={() => handleImageClick(preview.url)}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <IoIosRemoveCircleOutline
                  size={24}
                  color="red"
                  title="Remove"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
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

export default LiquidReceipt;
