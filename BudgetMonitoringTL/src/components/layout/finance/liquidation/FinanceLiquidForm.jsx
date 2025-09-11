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
import LiquidApprovalTable from "../../team-leader/liquidation/LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "../../team-leader/liquidation/LiquidationReceipt";
import { normalizeBase64Image } from "../../../../utils/signature";

const FinanceLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [signatures, setSignatures] = useState({
    released: data?.signatures?.released
      ? normalizeBase64Image(data.signatures.released)
      : null,
    releasedName: data?.signatures?.releasedName || "",
  });

  const [newReceipts, setNewReceipts] = useState([]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const existingReceipts = useMemo(() => {
    const fromData = Array.isArray(data?.receipts)
      ? data.receipts.map(normalizeBase64Image)
      : data?.receipts
      ? [normalizeBase64Image(data.receipts)]
      : [];

    const fromActivities = Array.isArray(data?.liquidation_activities)
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

    return Array.from(new Set([...fromData, ...fromActivities]));
  }, [data]);

  const receiptImages = useMemo(
    () => Array.from(new Set([...existingReceipts, ...newReceipts])),
    [existingReceipts, newReceipts]
  );

  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  const handleReceiptUpload = async (files) => {
    const base64List = await Promise.all(
      files.map(async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => resolve(normalizeBase64Image(e.target.result));
          reader.readAsDataURL(file);
        });
      })
    );
    setNewReceipts((prev) => [...prev, ...base64List]);
  };

  // APPROVE / REJECT
  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = parseInt(localStorage.getItem("employee_id"), 10) || 0;

      const status = action === "approve" ? "VERIFIED" : "REJECTED";
      const remarks =
        action === "reject" ? prompt("Enter remarks for rejection:") || "" : "";

      const payload = {
        id: data?.id,
        status,
        remarks,
        signature: signatures.released || "",
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

  // RENDER FIELDS
  const renderInfoFields = () => (
    <Row>
      <Col md={6}>
        {liquidationLeftFields.map(({ label, key }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">{data?.[key] || "N/A"}</p>
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
          approveLabel="Approve"
        />

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          setNewReceipts={handleReceiptUpload}
        />

        <SignatureUpload
          label="Released by"
          nameKey="releasedName"
          signatureKey="released"
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

export default FinanceLiquidForm;
