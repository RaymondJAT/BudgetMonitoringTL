import { useState, useEffect } from "react";
import LiquidForm from "../liquidation-request/LiquidForm";
import LiquidTable from "../liquidation-request/LiquidTable";
import LiquidReceipt from "../liquidation-request/LiquidReceipt";

const LiqReqForm = ({ requestData = null, onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];
  const loggedInUser = localStorage.getItem("employee_fullname") || "";

  const [formData, setFormData] = useState({
    description: "",
    employee: "",
    department: "",
    created_date: today,
    created_by: loggedInUser, // 🔹 always pre-fill hidden value
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

  const [receipts, setReceipts] = useState([]);

  // AUTO FILL if editing existing request
  useEffect(() => {
    if (requestData) {
      setFormData((prev) => ({
        ...prev,
        description: requestData.description || "",
        employee: requestData.employee || "",
        department: requestData.department || "",
        created_date: today,
        created_by: loggedInUser, // 🔹 stays hidden but included
        amount_obtained: parseFloat(requestData.amount_issue) || 0,
        remarks: requestData.remarks || "",
      }));

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
      created_by: loggedInUser, // 🔹 always attach before submit
      reference_id: requestData?.reference_id || "",
      request_items: liqRows,
      receipts,
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
    </form>
  );
};

export default LiqReqForm;
