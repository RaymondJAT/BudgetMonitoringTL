import { useState, useRef } from "react";
import { Form, Modal } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "../../../ui/AppButton";

const LiquidReceipt = ({ remarksValue = "", onRemarksChange = () => {} }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const fileInputRef = useRef(null);

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

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
      {/* REMARKS FIELD */}
      <Form.Group controlId="remarks" className="mb-3">
        <Form.Label className="fw-bold">Remarks</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          value={remarksValue}
          onChange={onRemarksChange}
          placeholder="Enter any remarks"
          className="small-input"
        />
      </Form.Group>

      {/* UPLOAD RECEIPTS */}
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label className="fw-bold">Upload Receipts</Form.Label>
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="d-none"
              ref={fileInputRef}
            />
            <AppButton
              label="Choose File"
              variant="outline-dark"
              onClick={handleButtonClick}
              className="custom-app-button"
            />
          </div>

          <AppButton
            label="Clear All"
            variant="outline-danger"
            onClick={handleClearImages}
            disabled={previews.length === 0}
            className="custom-app-button"
          />
        </div>
      </Form.Group>

      {/* IMAGE PREVIEWS */}
      {previews.length > 0 && (
        <div className="mt-4">
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
                className="position-relative mt-2"
                style={{ display: "inline-block" }}
              >
                <img
                  src={preview.url}
                  alt={`Receipt ${index + 1}`}
                  onClick={() => handleImageClick(preview.url)}
                  style={{ maxWidth: "150px", maxHeight: "150px" }}
                />
                <IoIosRemoveCircleOutline
                  size={18}
                  className="remove-icon"
                  title="Remove"
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FOR FULL IMAGE */}
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
