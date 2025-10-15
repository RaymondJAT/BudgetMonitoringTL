import { useState, useCallback, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppButton from "../../buttons/AppButton";
import EditRequestForm from "../../../layout/employee/cash-request/EditRequestForm";
import { numberToWords } from "../../../../utils/numberToWords";

const EditCashRequest = ({ show, onHide, requestData = {}, onSubmit }) => {
  const [formOutput, setFormOutput] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
    const {
      description,
      team_lead,
      amount,
      cash_request_id,
      id,
      request_date,
    } = formOutput;
    const cashRequestId = cash_request_id || id;

    // 🚨 Validation (with Swal)
    if (!description?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Particulars is required.",
        confirmButtonColor: "#800000",
      });
      return;
    }
    if (!team_lead?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Team Lead is required.",
        confirmButtonColor: "#800000",
      });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Amount is required and must be greater than zero.",
        confirmButtonColor: "#800000",
      });
      return;
    }
    if (!cashRequestId) {
      Swal.fire({
        icon: "error",
        title: "Missing Data",
        text: "Missing cash request ID.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Expired",
        text: "Please log in again.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        cash_request_id: cashRequestId,
        description,
        team_lead,
        amount,
        updated_by: localStorage.getItem("employee_name") || "admin",
        request_date,
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

      Swal.fire({
        icon: "success",
        title: "Changes Saved",
        text: "The cash request has been updated successfully.",
        confirmButtonColor: "#800000",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/employee_request");
        handleCloseModal();
      });
    } catch (error) {
      console.error("Error updating cash request:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#800000",
      });
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
