import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { numberToWords } from "../../../../utils/numberToWords";
import { cashReqFields } from "../../../../handlers/columnHeaders";
import RequestForm from "../cash-request/RequestForm";
import CashReqTable from "./CashReqTable";
import SignatureUpload from "../../../SignatureUpload";

const CashReqForm = ({ data = {}, onChange = () => {} }) => {
  const today = new Date().toISOString().split("T")[0];
  const loggedInUser = localStorage.getItem("employee_fullname") || "";
  const departmentName = localStorage.getItem("department_name") || "";
  const positionName = localStorage.getItem("position_name") || "";

  // Helper: convert any base64 signature to proper data URI
  const getSignatureDataUri = (signature) => {
    if (!signature) return null;
    try {
      const parts = signature.split(":");
      const base64 =
        parts.length === 3 && parts[0] === "base64" ? parts[2] : signature;
      return `data:image/png;base64,${base64}`;
    } catch {
      return null;
    }
  };

  // Initialize rows and signature from API response or default
  const initialRows =
    data.cash_request_items?.length > 0
      ? data.cash_request_items.map((item) => ({
          label: item.label || "",
          price: item.price || 0,
          quantity: item.quantity || 0,
        }))
      : [{ label: "", price: 0, quantity: 0 }];

  const initialSignature = getSignatureDataUri(
    data.cash_request_activities?.[0]?.signature
  );

  // Form data state
  const [formData, setFormData] = useState({
    employee: loggedInUser,
    requested_by: loggedInUser,
    department: departmentName,
    position: positionName,
    expenseDate: data.request_date?.split("T")[0] || today,
    teamLead: data.team_lead || "",
    description: data.description || "",
  });

  // Rows state
  const [rows, setRows] = useState(initialRows);

  // Signature state
  const [signatures, setSignatures] = useState({
    requestedName: loggedInUser,
    requestSignature: initialSignature,
  });

  // Calculate total
  const total = rows.reduce(
    (sum, row) =>
      sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
    0
  );

  const amountInWords = total ? numberToWords(total) : "Zero Pesos Only";

  // Map form data to backend structure and trigger onChange
  useEffect(() => {
    const mapped = {
      description: formData.description || "",
      team_lead: formData.teamLead || "",
      employee: formData.employee || "",
      department: formData.department || "",
      position: formData.position || "",
      action: "REQUESTED",
      remarks: "",
      signature: signatures.requestSignature || "",
      requested_by: formData.employee || "",
      request_items: rows.map((row) => ({
        label: row.label,
        price: Number(row.price) || 0,
        quantity: Number(row.quantity) || 0,
        subtotal: (Number(row.price) || 0) * (Number(row.quantity) || 0),
      })),
    };

    onChange(mapped);
  }, [formData, rows, signatures, total, onChange]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddRow = () =>
    setRows((prev) => [...prev, { label: "", price: 0, quantity: 0 }]);

  const handleRemoveRow = (index) => {
    setRows((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated.length ? updated : [{ label: "", price: 0, quantity: 0 }];
    });
  };

  return (
    <Container fluid>
      <RequestForm
        fields={cashReqFields}
        formData={formData}
        onChange={handleInputChange}
        amountInWords={amountInWords}
      />

      <CashReqTable
        rows={rows}
        onRowChange={handleRowChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
      />

      <div className="mt-3">
        <SignatureUpload
          label="Requested by"
          nameKey="requestedName"
          signatureKey="requestSignature"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </div>
    </Container>
  );
};

export default CashReqForm;
