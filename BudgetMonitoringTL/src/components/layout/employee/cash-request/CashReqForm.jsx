import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { numberToWords } from "../../../../utils/numberToWords";
import { cashReqFields } from "../../../../handlers/columnHeaders";
import RequestForm from "../cash-request/RequestForm";
import CashReqTable from "./CashReqTable";
import SignatureUpload from "../../../SignatureUpload";

const CashReqForm = ({ data = {}, particulars = [], onChange = () => {} }) => {
  const [formData, setFormData] = useState({
    employee: "",
    expenseDate: "",
    department: "",
    teamLead: "",
    position: "",
    description: "",
    ...data,
  });

  const [signatures, setSignatures] = useState({
    approvedName: "",
    requestSignature: null,
  });

  const [rows, setRows] = useState(
    particulars.length ? particulars : [{ label: "", price: "", quantity: "" }]
  );

  const total = rows.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    const quantity = parseFloat(row.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const amountInWords = total ? numberToWords(total) : "Zero Pesos Only";

  useEffect(() => {
    onChange({ ...formData, particulars: rows, total, amountInWords });
  }, [formData, rows, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { label: "", price: "", quantity: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(
      updated.length ? updated : [{ label: "", price: "", quantity: "" }]
    );
  };

  return (
    <Container fluid>
      {/* CASH REQUEST FORM */}
      <RequestForm
        fields={cashReqFields}
        formData={formData}
        onChange={handleInputChange}
        amountInWords={amountInWords}
      />
      {/* CASH REQ TABLE */}
      <CashReqTable
        rows={rows}
        onRowChange={handleRowChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
      />
      {/* CASH REQ SIGNATURE */}
      <div className="mt-3">
        <SignatureUpload
          label="Requested by"
          nameKey="approvedName"
          signatureKey="requestSignature"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </div>
    </Container>
  );
};

export default CashReqForm;
