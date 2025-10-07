import { useState, useRef, useEffect, useCallback } from "react";
import { Form, Modal } from "react-bootstrap";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppButton from "../../../ui/buttons/AppButton";
import { normalizeBase64Image } from "../../../../utils/image";

const LiquidReceipt = ({
  receipts = [],
  remarksValue = "",
  onRemarksChange = () => {},
  onReceiptsChange = () => {},
}) => {
  const [previews, setPreviews] = useState(
    receipts.map((r) => ({
      url: r.image || r,
      base64: r.image || r,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const fileInputRef = useRef(null);

  /** 🔹 Convert File → Base64 */
  const fileToBase64 = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(normalizeBase64Image(reader.result));
        reader.onerror = reject;
      }),
    []
  );

  /** 🔹 Handle file upload */
  const handleImageChange = useCallback(
    async (e) => {
      const files = Array.from(e.target.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (!files.length) return;

      const base64List = await Promise.all(files.map(fileToBase64));

      const newPreviews = files.map((file, i) => ({
        url: URL.createObjectURL(file),
        base64: base64List[i],
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
      e.target.value = ""; // reset input for same-file reselect
    },
    [fileToBase64]
  );

  /** 🔹 Sync with parent (send only base64s) */
  useEffect(() => {
    onReceiptsChange(previews.map((p) => p.base64));
  }, [previews, onReceiptsChange]);

  /** 🔹 Cleanup object URLs on unmount */
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  /** 🔹 Handlers */
  const handleButtonClick = () => fileInputRef.current?.click();
  const handleImageClick = (src) => {
    setModalImage(src);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleClearImages = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  const handleRemoveImage = (index) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="request-container border p-3 mt-3">
      {/* Remarks Field */}
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

      {/* Upload Receipts */}
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label className="fw-bold">Upload Receipts</Form.Label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="d-none"
          />
          <AppButton
            label="Choose File"
            variant="outline-dark"
            onClick={handleButtonClick}
            className="custom-app-button"
          />
          <AppButton
            label="Clear All"
            variant="outline-danger"
            onClick={handleClearImages}
            disabled={!previews.length}
            className="custom-app-button"
          />
        </div>
      </Form.Group>

      {/* Image Previews */}
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
                  src={preview.base64 || preview.url}
                  alt={`Receipt ${index + 1}`}
                  onClick={() =>
                    handleImageClick(preview.base64 || preview.url)
                  }
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

      {/* Modal for Full Image */}
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
