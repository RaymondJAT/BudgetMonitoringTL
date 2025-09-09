import { useState, useEffect } from "react";
import LiquidForm from "../liquidation-request/LiquidForm";
import LiquidTable from "../liquidation-request/LiquidTable";
import LiquidReceipt from "../liquidation-request/LiquidReceipt";
import SignatureUpload from "../../../SignatureUpload";

const LiqReqForm = ({ requestData = null }) => {
  const [formData, setFormData] = useState({
    description: "",
    employee: "",
    department: "",
    created_date: new Date().toISOString().split("T")[0],
    amount_obtained: 0,
    amount_expended: "",
    reimburse_return: "",
    remarks: "",
  });

  // Table rows
  const [liqRows, setLiqRows] = useState([]);

  // Signature
  const [signatures, setSignatures] = useState({
    preparedBy: "",
    preparedSignature: "",
  });

  useEffect(() => {
    console.log(requestData);

    if (("res", requestData)) {
      setFormData((prev) => ({
        ...prev,
        description: requestData.description || "",
        employee: requestData.employee || "",
        department: requestData.department || "",
        created_date: new Date().toISOString().split("T")[0],
        amount_obtained: requestData.amount_issue || 0,
      }));

      if (requestData.request_items && requestData.request_items.length > 0) {
        const rows = requestData.request_items.map((item) => ({
          date: item.date || "",
          rt: item.rt || "",
          store: item.store_name || "",
          particulars: item.particulars || "",
          from: item.from || "",
          to: item.to || "",
          mode: item.mode_of_transportation || "",
          amount: item.amount || 0,
        }));
        setLiqRows(rows);
      } else {
        setLiqRows([
          {
            date: "",
            rt: "",
            store: "",
            particulars: "",
            from: "",
            to: "",
            mode: "",
            amount: "",
          },
        ]);
      }
    }
  }, [requestData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLiqRowChange = (index, field, value) => {
    const updated = [...liqRows];
    updated[index][field] = value;
    setLiqRows(updated);
  };

  const handleAddLiqRow = () => {
    setLiqRows((prev) => [
      ...prev,
      {
        date: "",
        rt: "",
        store: "",
        particulars: "",
        from: "",
        to: "",
        mode: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveLiqRow = (index) => {
    setLiqRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSignatureUpload = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* LIQUIDATION FORM */}
      <LiquidForm
        formData={formData}
        onChange={handleInputChange}
        liqRows={liqRows}
        onLiqRowChange={handleLiqRowChange}
        onAddLiqRow={handleAddLiqRow}
        onRemoveLiqRow={handleRemoveLiqRow}
      />

      {/* LIQUIDATION TABLE */}
      <LiquidTable
        tableRows={liqRows}
        onRowChange={handleLiqRowChange}
        onAddRow={handleAddLiqRow}
        onRemoveRow={handleRemoveLiqRow}
      />

      {/* LIQUIDATION UPLOAD RECEIPT */}
      <LiquidReceipt
        remarksValue={formData.remarks}
        onRemarksChange={(e) =>
          setFormData((prev) => ({ ...prev, remarks: e.target.value }))
        }
      />

      {/* LIQUIDATION SIGNATURE */}
      <div className="mt-3">
        <SignatureUpload
          label="Prepared by"
          nameKey="preparedBy"
          signatureKey="preparedSignature"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </div>
    </div>
  );
};

export default LiqReqForm;
