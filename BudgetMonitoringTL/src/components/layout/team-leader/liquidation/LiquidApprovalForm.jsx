import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ActionButtons";
import SignatureUpload from "../../../SignatureUpload";
import LiquidApprovalTable from "./LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "./LiquidationReceipt";
import { normalizeBase64Image } from "../../../../utils/signature";

const LiquidApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [signatures, setSignatures] = useState({
    verified: data?.signatures?.verified
      ? normalizeBase64Image(data.signatures.verified)
      : null,
    verifiedName: data?.signatures?.verifiedName || "",
  });

  const [newReceipts, setNewReceipts] = useState([]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // -----------------------------
  // Combine existing receipts from data.receipts and liquidation_activities
  // -----------------------------
  const existingReceipts = useMemo(() => {
    const receiptsFromData = Array.isArray(data?.receipts)
      ? data.receipts.map(normalizeBase64Image)
      : data?.receipts
      ? [normalizeBase64Image(data.receipts)]
      : [];

    const receiptsFromActivities = Array.isArray(data?.liquidation_activities)
      ? data.liquidation_activities
          .filter((act) => act.receipts)
          .flatMap((act) => {
            try {
              const parsed = JSON.parse(act.receipts);
              return Array.isArray(parsed)
                ? parsed.map((r) => normalizeBase64Image(r.image || r))
                : [normalizeBase64Image(act.receipts)];
            } catch {
              return [normalizeBase64Image(act.receipts)];
            }
          })
      : [];

    return Array.from(
      new Set([...receiptsFromData, ...receiptsFromActivities])
    );
  }, [data]);

  const receiptImages = useMemo(() => {
    return Array.from(new Set([...existingReceipts, ...newReceipts]));
  }, [existingReceipts, newReceipts]);

  // -----------------------------
  // Set transactions and total
  // -----------------------------
  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.amount ?? 0),
      0
    );
    setTotal(totalAmount);
  }, [data]);

  // -----------------------------
  // Handle Approve / Reject
  // -----------------------------
  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = parseInt(localStorage.getItem("employee_id"), 10) || 0;

      const status = action === "approve" ? "CHECKED" : "REJECTED";
      let remarks = "";

      if (action === "reject") {
        remarks = prompt("Enter remarks for rejection:") || "";
      }

      const payload = {
        id: data?.id,
        status,
        remarks,
        signature: signatures.verified || "",
        receipts: JSON.stringify(receiptImages),
        created_by: employeeId,
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

  // -----------------------------
  // Render Info Fields
  // -----------------------------
  const renderInfoFields = () => (
    <Row>
      <Col md={6}>
        {liquidationLeftFields.map(({ label, key }, index) => (
          <Row key={index} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">{data?.[key] || "N/A"}</p>
            </Col>
          </Row>
        ))}
      </Col>

      <Col md={6}>
        {liquidationRightFields.map(({ label, key }, index) => (
          <Row key={index} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">
                {typeof data?.[key] === "number"
                  ? `₱${parseFloat(data[key]).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : data?.[key] || "N/A"}
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
        />

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          setNewReceipts={setNewReceipts} // allow tracking new uploads
        />

        <SignatureUpload
          label="Noted by"
          nameKey="verifiedName"
          signatureKey="verified"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </Container>

      <div className="d-none">
        <PrintableLiquidForm
          data={{ ...data }}
          contentRef={contentRef}
          signatures={signatures}
        />
      </div>
    </>
  );
};

export default LiquidApprovalForm;
