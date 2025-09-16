import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ActionButtons";
import LiquidApprovalTable from "../../team-leader/liquidation/LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "../../team-leader/liquidation/LiquidationReceipt";
import { normalizeBase64Image } from "../../../../utils/image";
import PickRevolvingFund from "../../../ui/modal/admin/PickRevolvingFund";

const FinanceLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  const [showFundModal, setShowFundModal] = useState(false);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // Combine existing receipts and new uploads
  const receiptImages = useMemo(() => {
    const requesterReceipts = [
      ...(Array.isArray(data?.receipts)
        ? data.receipts
        : data?.receipts
        ? [data.receipts]
        : []),
      ...(Array.isArray(data?.liquidation_activities)
        ? data.liquidation_activities.flatMap((act) => {
            if (!act.receipts) return [];
            try {
              const parsed = JSON.parse(act.receipts);
              return Array.isArray(parsed)
                ? parsed.map((r) => normalizeBase64Image(r.image || r))
                : [normalizeBase64Image(act.receipts)];
            } catch {
              return [normalizeBase64Image(act.receipts)];
            }
          })
        : []),
    ].map(normalizeBase64Image);

    return Array.from(new Set(requesterReceipts));
  }, [data]);

  // Populate transactions and total
  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  // Handle new receipt uploads
  const handleReceiptUpload = async (files) => {
    const base64List = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve(normalizeBase64Image(e.target.result));
            reader.readAsDataURL(file);
          })
      )
    );
    setNewReceipts((prev) => [...prev, ...base64List]);
  };

  const handleApprove = async (fundId) => {
    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Unknown";

      // LIQUIDATION UPDATE
      const liquidationPayload = {
        id: data?.id,
        status: "verified",
        remarks: "",
        created_by: employeeName,
      };

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(liquidationPayload),
      });

      if (!res.ok) throw new Error("Failed to approve liquidation");
      const liquidationResponse = await res.json();

      // BACKEND CALCULATION
      const updated = Array.isArray(liquidationResponse)
        ? liquidationResponse[0]
        : liquidationResponse;

      // CASH DISBURSEMENT UPDATE
      const disbursementPayload = {
        rf_id: fundId,
        amount_expended: parseFloat(updated.amount_expended) || 0,
        amount_return: parseFloat(updated.amount_return) || 0,
        amount_reimburse: parseFloat(updated.amount_reimburse) || 0,
        cash_voucher: updated.cash_voucher || data?.cv_number,
      };

      const resDisb = await fetch(
        `/api5001/cash_disbursement/updatecash_disbursement_cv`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(disbursementPayload),
        }
      );

      if (!resDisb.ok) throw new Error("Failed to update cash disbursement");
      await resDisb.json();

      alert("Liquidation verified and cash disbursement updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Approve error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  // REJECT ACTION
  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = parseInt(localStorage.getItem("employee_id"), 10) || 0;

      const remarks = prompt("Enter remarks for rejection:") || "";

      const payload = {
        id: data?.id,
        status: "rejected",
        remarks,
        created_by: employeeId,
      };

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to reject liquidation");
      await res.json();

      alert("Liquidation rejected successfully!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Reject error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  // Render info fields
  const renderInfoFields = () => (
    <Row>
      <Col md={6}>
        {liquidationLeftFields.map(({ label, key }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">{data?.[key] ?? "N/A"}</p>
            </Col>
          </Row>
        ))}
      </Col>

      <Col md={6}>
        {liquidationRightFields.map(({ label, key }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">
                {typeof data?.[key] === "number"
                  ? `₱${parseFloat(data[key]).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : data?.[key] ?? "N/A"}
              </p>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  return (
    <>
      <Container fluid className="pb-3">
        <ActionButtons
          onApprove={() => setShowFundModal(true)}
          onReject={handleReject}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          approveLabel="Approve"
          status={data?.status}
          role="finance"
        />

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt images={receiptImages} />
      </Container>

      {/* Hidden print template */}
      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>

      {/* Pick revolving fund modal */}
      <PickRevolvingFund
        show={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSelect={(fundId) => {
          setShowFundModal(false);
          handleApprove(fundId);
        }}
      />
    </>
  );
};

export default FinanceLiquidForm;
