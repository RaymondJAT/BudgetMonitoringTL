import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Alert } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";
import LiquidTable from "../../../layout/employee/liquidation-request/LiquidTable";
import LiquidReceipt from "../../../layout/employee/liquidation-request/LiquidReceipt";

const EditLiquidation = ({ show, onHide, requestData, onSave }) => {
  const [tableRows, setTableRows] = useState([]);

  const [remarks, setRemarks] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load existing data into table and receipt sections
  useEffect(() => {
    if (requestData) {
      const rows =
        requestData?.liquidation_items?.length > 0
          ? requestData.liquidation_items.map((item) => ({
              id: item.id || 0,
              date: item.date || "N/A",
              rt: item.rt || "",
              store_name: item.store_name || "",
              particulars: item.particulars || "",
              from: item.from || "",
              to: item.to || "",
              mode_of_transportation: item.mode_of_transportation || "",
              amount:
                item.amount === null ||
                item.amount === undefined ||
                item.amount === ""
                  ? "N/A"
                  : item.amount,
            }))
          : [
              {
                date: "N/A",
                rt: "",
                store_name: "",
                particulars: "",
                from: "",
                to: "",
                mode_of_transportation: "",
                amount: "N/A",
              },
            ];

      setTableRows(rows);
      setRemarks(requestData.remarks || "");
      setReceipts(requestData.receipts || []);
    }
  }, [requestData]);

  // ✅ Handle row edit (same logic as in LiqReqForm)
  const handleRowChange = (index, field, value) => {
    const updated = [...tableRows];
    updated[index][field] = value;
    setTableRows(updated);
  };

  // ✅ Add new row (matches LiqReqForm behavior)
  const handleAddRow = (newRow, insertIndex = null) => {
    const defaultRow = {
      date: "",
      rt: "",
      store_name: "",
      particulars: "",
      from: "",
      to: "",
      mode_of_transportation: "",
      amount: "",
    };

    setTableRows((prev) => {
      const updated = [...prev];
      if (insertIndex !== null && insertIndex >= 0) {
        updated.splice(insertIndex, 0, newRow || defaultRow);
      } else {
        updated.push(newRow || defaultRow);
      }
      return updated;
    });
  };

  // ✅ Remove a row
  const handleRemoveRow = (index) => {
    setTableRows((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Save edited liquidation
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication expired. Please log in again.");
      return;
    }

    const payload = {
      liquidation_id: requestData.id,
      items: tableRows.map((row) => ({
        id: row.id || 0,
        date: row.date,
        rt: row.rt,
        store_name: row.store_name,
        particulars: row.particulars,
        from: row.from,
        to: row.to,
        mode_of_transportation: row.mode_of_transportation,
        amount: row.amount === "N/A" ? "N/A" : parseFloat(row.amount || 0),
      })),
      remarks,
      receipts: receipts.map((r, idx) => ({
        id: r.id != null ? r.id : idx.toString(),
        image: typeof r === "string" ? r : r.image,
      })),
    };

    try {
      setError("");
      const res = await fetch(
        "/api5012/liquidation/update_liquidation_rejected",
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
        throw new Error(errText);
      }

      await res.json();

      onSave?.({
        id: requestData.id,
        liquidation_items: payload.items,
        remarks: payload.remarks,
        receipts: payload.receipts,
      });

      navigate("/employee_liquidation");
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title>EDIT LIQUIDATION</Modal.Title>
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

        {/* ✅ Liquidation table behaves same as in LiqReqForm */}
        <LiquidTable
          tableRows={tableRows}
          onRowChange={handleRowChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
        />

        {/* ✅ Remarks + Receipts */}
        <LiquidReceipt
          remarksValue={remarks}
          onRemarksChange={(e) => setRemarks(e.target.value)}
          receipts={receipts}
          onReceiptsChange={setReceipts}
        />
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
        <AppButton
          label="Update"
          variant="outline-success"
          onClick={handleSave}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditLiquidation;
