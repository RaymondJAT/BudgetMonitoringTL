import { useState, useCallback, useEffect } from "react";
import { Modal, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppButton from "../../buttons/AppButton";
import EditRequestForm from "../../../layout/employee/cash-request/EditRequestForm"; // 👈 use the new simplified form
import { numberToWords } from "../../../../utils/numberToWords";

const EditCashRequest = ({ show, onHide, requestData = {}, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountInWords, setAmountInWords] = useState("Zero Pesos Only");
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Initialize formOutput with correct mapping
  useEffect(() => {
    if (requestData) {
      const initialData = {
        ...requestData,
        cash_request_id: requestData.cash_request_id || requestData.id,
        request_date: requestData.request_date
          ? requestData.request_date.split("T")[0]
          : today,
        description: requestData.description || "",
        team_lead: requestData.team_lead || "",
        amount: requestData.amount || "",
      };
      setFormOutput(initialData);
      setAmount(initialData.amount || "");
      setAmountInWords(
        initialData.amount
          ? numberToWords(parseFloat(initialData.amount))
          : "Zero Pesos Only"
      );
    }
  }, [requestData, today]);

  const handleCloseModal = () => {
    if (!submitting) {
      setError("");
      onHide();
    }
  };

  // Update form state
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormOutput((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle amount changes from table
  const handleAmountChange = (value) => {
    setAmount(value);
    setFormOutput((prev) => ({ ...prev, amount: value }));
    setAmountInWords(
      value ? numberToWords(parseFloat(value)) : "Zero Pesos Only"
    );
  };

  const handleClearAmount = () => {
    setAmount("");
    setFormOutput((prev) => ({ ...prev, amount: "" }));
    setAmountInWords("Zero Pesos Only");
  };

  const handleSave = async () => {
    const cashRequestId = formOutput.cash_request_id || formOutput.id;
    if (!cashRequestId) {
      setError("Missing cash request ID.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication expired. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        cash_request_id: cashRequestId,
        description: formOutput.description,
        team_lead: formOutput.team_lead,
        amount: formOutput.amount,
        updated_by: localStorage.getItem("employee_name") || "admin",
        request_date: formOutput.request_date,
      };

      const res = await fetch(
        "/api5012/cash_request/update_cash_request_rejected",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }

      const result = await res.json();
      if (onSubmit) onSubmit(result.data || payload);

      // ✅ Redirect after saving
      navigate("/employee_request");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating cash request:", error);
      setError(error.message || "Something went wrong. Please try again.");
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
          Edit Cash Request
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="cashreq-scroll"
        style={{ backgroundColor: "#800000" }}
      >
        {error && (
          <Alert
            variant="danger"
            className="mb-3"
            onClose={() => setError("")}
            dismissible
          >
            {error}
          </Alert>
        )}

        <EditRequestForm
          formData={formOutput}
          onChange={handleFormChange}
          amount={amount}
          onAmountChange={handleAmountChange}
          onClear={handleClearAmount}
          amountInWords={amountInWords}
        />
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
                Saving...
              </>
            ) : (
              "Save Changes"
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

export default EditCashRequest;
