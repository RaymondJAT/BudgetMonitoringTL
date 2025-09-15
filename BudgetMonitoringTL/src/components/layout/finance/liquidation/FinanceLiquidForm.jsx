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

const FinanceLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [newReceipts, setNewReceipts] = useState([]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // Combine existing receipts and new uploads
  const receiptImages = useMemo(() => {
    const existingReceipts = [
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

    return Array.from(new Set([...existingReceipts, ...newReceipts]));
  }, [data, newReceipts]);

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

  // Approve / Reject action
  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = parseInt(localStorage.getItem("employee_id"), 10) || 0;

      const status = action === "approve" ? "verified" : "rejected";
      const remarks =
        action === "reject" ? prompt("Enter remarks for rejection:") || "" : "";

      const payload = {
        id: data?.id,
        status,
        remarks,
        created_by: employeeId,
        ...(newReceipts.length > 0 && {
          receipts: JSON.stringify(newReceipts),
        }),
      };

      console.log("🔼 Sending payload:", payload);

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update liquidation");
      await res.json();

      alert(`Liquidation ${status} successfully!`);
      navigate(-1);
    } catch (err) {
      console.error(err);
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
          onApprove={() => handleAction("approve")}
          onReject={() => handleAction("reject")}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          approveLabel="Approve"
        />

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          setNewReceipts={handleReceiptUpload}
        />
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>
    </>
  );
};

export default FinanceLiquidForm;
