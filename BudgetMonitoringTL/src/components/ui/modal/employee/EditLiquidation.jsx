import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import AppButton from "../../buttons/AppButton";
import LiquidTable from "../../../layout/employee/liquidation-request/LiquidTable";
import LiquidReceipt from "../../../layout/employee/liquidation-request/LiquidReceipt";
import { saveDraft, getDraft, deleteDraft } from "../../../../utils/indexedDB";

const EditLiquidation = ({ show, onHide, requestData, onSave }) => {
  const [tableRows, setTableRows] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // unique draft key
  const draftKey = requestData ? `edit_${requestData.id}` : "edit_draft";

  // 🧠 LOAD DRAFT OR EXISTING DATA
  useEffect(() => {
    async function loadData() {
      if (!requestData) return;

      const saved = await getDraft(draftKey);
      if (saved) {
        console.log("📦 Loaded edit draft:", saved);
        setTableRows(saved.tableRows || []);
        setRemarks(saved.remarks || "");
        setReceipts(saved.receipts || []);
        return;
      }

      const rows =
        requestData?.liquidation_items?.length > 0
          ? requestData.liquidation_items.map((item) => ({
              id: item.id || 0,
              date: item.date || "",
              rt: item.rt || "",
              store_name: item.store_name || "",
              particulars: item.particulars || "",
              from: item.started_from || "",
              to: item.ended_to || "",
              mode_of_transportation: item.li_mode_of_transportation || "",
              amount:
                item.amount === null ||
                item.amount === undefined ||
                item.amount === ""
                  ? ""
                  : item.amount,
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
            ];

      setTableRows(rows);
      setRemarks(requestData.remarks || "");
      setReceipts(requestData.receipts || []);
    }

    loadData();
  }, [requestData, draftKey]);

  // 💾 AUTO-SAVE DRAFT
  useEffect(() => {
    if (!requestData) return;

    const saveTimeout = setTimeout(() => {
      const dataToSave = {
        tableRows,
        remarks,
        receipts,
        updatedAt: new Date(),
      };
      saveDraft(draftKey, dataToSave);
      console.log("💾 Auto-saved edit draft:", draftKey);
    }, 600);

    return () => clearTimeout(saveTimeout);
  }, [tableRows, remarks, receipts, draftKey, requestData]);

  // 🧹 DELETE DRAFT AFTER SUCCESSFUL UPDATE
  const handleSave = async () => {
    // ✅ Validation for missing date
    const hasMissingDate = tableRows.some((row) => {
      const hasOtherFieldsFilled =
        row.rt?.trim() ||
        row.store_name?.trim() ||
        row.particulars?.trim() ||
        row.from?.trim() ||
        row.to?.trim() ||
        row.mode_of_transportation?.trim() ||
        (row.amount && parseFloat(row.amount) > 0);

      return hasOtherFieldsFilled && (!row.date || row.date.trim() === "");
    });

    if (hasMissingDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Date",
        text: "Please fill in the Date for all rows that have details before submitting.",
        confirmButtonColor: "#800000",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Expired",
        text: "Please log in again to continue.",
        confirmButtonColor: "#800000",
      });
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
      await deleteDraft(draftKey);
      console.log("🧹 Deleted edit draft:", draftKey);

      onSave?.({
        id: requestData.id,
        liquidation_items: payload.items,
        remarks: payload.remarks,
        receipts: payload.receipts,
      });

      // ✅ Success Swal (auto close, no button)
      Swal.fire({
        icon: "success",
        title: "Liquidation Updated",
        text: "Your changes have been successfully saved.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      onHide();
      navigate("/employee_liquidation");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#800000",
      });

      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="fullscreen">
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

        <LiquidTable
          tableRows={tableRows}
          onRowChange={(i, f, v) => {
            const updated = [...tableRows];
            updated[i][f] = v;
            setTableRows(updated);
          }}
          onAddRow={(r, i) => {
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
              if (i != null && i >= 0) updated.splice(i, 0, r || defaultRow);
              else updated.push(r || defaultRow);
              return updated;
            });
          }}
          onRemoveRow={(i) =>
            setTableRows((prev) => prev.filter((_, j) => j !== i))
          }
        />

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
