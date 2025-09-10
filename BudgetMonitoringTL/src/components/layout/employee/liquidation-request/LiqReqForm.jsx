import { useState, useEffect } from "react";
import LiquidForm from "../liquidation-request/LiquidForm";
import LiquidTable from "../liquidation-request/LiquidTable";
import LiquidReceipt from "../liquidation-request/LiquidReceipt";
import SignatureUpload from "../../../SignatureUpload";
import { normalizeBase64Image } from "../../../../utils/signature";

const LiqReqForm = ({ requestData = null, onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];
  const loggedInUser = localStorage.getItem("employee_fullname") || "";

  const [formData, setFormData] = useState({
    description: "",
    employee: "",
    department: "",
    created_date: today,
    amount_obtained: 0,
    amount_expended: 0,
    reimburse_return: "",
    remarks: "",
  });

  const [liqRows, setLiqRows] = useState([
    {
      date: "",
      rt: "",
      store_name: "",
      particulars: "",
      from: "",
      to: "",
      mode_of_transportation: "",
      amount: "",
    },
  ]);

  const initialSignature = normalizeBase64Image(requestData?.signature);
  const [signatures, setSignatures] = useState({
    created_by: loggedInUser,
    signature: initialSignature,
  });

  const [receipts, setReceipts] = useState([]);

  // AUTO FILL
  useEffect(() => {
    if (requestData) {
      setFormData({
        description: requestData.description || "",
        employee: requestData.employee || "",
        department: requestData.department || "",
        created_date: today,
        amount_obtained: parseFloat(requestData.amount_issue) || 0,
        amount_expended: 0,
        reimburse_return: "",
        remarks: requestData.remarks || "",
      });

      setSignatures({
        created_by: requestData.created_by || loggedInUser,
        signature: normalizeBase64Image(requestData.signature),
      });

      setLiqRows(
        requestData.request_items?.length
          ? requestData.request_items.map((item) => ({
              date: item.date || "",
              rt: item.rt || "",
              store_name: item.store_name || "",
              particulars: item.particulars || "",
              from: item.from || "",
              to: item.to || "",
              mode_of_transportation: item.mode_of_transportation || "",
              amount: item.amount || 0,
            }))
          : [
              {
                date: "",
                rt: "",
                store_name: "",
                particulars: "",
                from: "",
                to: "",
                mode_of_transportation: "",
                amount: "",
              },
            ]
      );
    }
  }, [requestData, today, loggedInUser]);

  // AUTO COMPUTE
  useEffect(() => {
    const totalExpended = liqRows.reduce(
      (sum, row) => sum + (parseFloat(row.amount) || 0),
      0
    );

    let reimburseOrReturn = 0;
    if (totalExpended < formData.amount_obtained) {
      reimburseOrReturn = formData.amount_obtained - totalExpended;
    } else if (totalExpended > formData.amount_obtained) {
      reimburseOrReturn = totalExpended - formData.amount_obtained;
    }

    setFormData((prev) => ({
      ...prev,
      amount_expended: totalExpended,
      reimburse_return: reimburseOrReturn,
    }));
  }, [liqRows, formData.amount_obtained]);

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLiqRowChange = (index, field, value) => {
    const updated = [...liqRows];
    updated[index][field] = value;
    setLiqRows(updated);
  };

  const handleAddLiqRow = () =>
    setLiqRows((prev) => [
      ...prev,
      {
        date: "",
        rt: "",
        store_name: "",
        particulars: "",
        from: "",
        to: "",
        mode_of_transportation: "",
        amount: "",
      },
    ]);

  const handleRemoveLiqRow = (index) =>
    setLiqRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      reference_id: requestData?.reference_id || "",
      request_items: liqRows,
      receipts,
      created_by: signatures.created_by,
      signature: signatures.signature,
    };

    console.log("Submitting liquidation payload:", payload);
    onSubmit(payload);
  };

  return (
    <form id="liq-req-form" onSubmit={handleSubmit}>
      <LiquidForm
        formData={formData}
        onChange={handleInputChange}
        liqRows={liqRows}
        onLiqRowChange={handleLiqRowChange}
        onAddLiqRow={handleAddLiqRow}
        onRemoveLiqRow={handleRemoveLiqRow}
      />

      <LiquidTable
        tableRows={liqRows}
        onRowChange={handleLiqRowChange}
        onAddRow={handleAddLiqRow}
        onRemoveRow={handleRemoveLiqRow}
      />

      <LiquidReceipt
        remarksValue={formData.remarks}
        onRemarksChange={(e) =>
          setFormData((prev) => ({ ...prev, remarks: e.target.value }))
        }
        onReceiptsChange={setReceipts}
      />

      <div className="mt-3">
        <SignatureUpload
          label="Prepared by"
          nameKey="created_by"
          signatureKey="signature"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </div>
    </form>
  );
};

export default LiqReqForm;
