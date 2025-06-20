import { useState } from "react";
import LiquidForm from "../liquidation/LiquidForm";
import LiquidTable from "../liquidation/LiquidTable";
import LiquidReceipt from "../liquidation/LiquidReceipt";
import LiquidSignature from "../liquidation/LiquidSignature";

const LiqReqForm = () => {
  const [formData, setFormData] = useState({
    employee: "",
    amountObtained: "",
    department: "",
    amountExpended: "",
    liquidationDate: "",
    reimburseReturn: "",
  });
  const [liqRows, setLiqRows] = useState([
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
  const [signatures, setSignatures] = useState({
    preparedBy: "",
    preparedSignature: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <LiquidTable />
      {/* LIQUIDATION UPLOAD RECEIPT */}
      <LiquidReceipt />
      {/* LIQUIDATION SIGNATURE */}
      <LiquidSignature
        signatures={signatures}
        setSignatures={setSignatures}
        handleSignatureUpload={handleSignatureUpload}
      />
    </div>
  );
};

export default LiqReqForm;
