import { useState } from "react";
import LiquidForm from "../../ui/employee/LiquidForm";

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
      <LiquidForm
        formData={formData}
        onChange={handleInputChange}
        liqRows={liqRows}
        onLiqRowChange={handleLiqRowChange}
        onAddLiqRow={handleAddLiqRow}
        onRemoveLiqRow={handleRemoveLiqRow}
      />
    </div>
  );
};

export default LiqReqForm;
