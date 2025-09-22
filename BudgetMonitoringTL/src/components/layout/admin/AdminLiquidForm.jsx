import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationRightFields,
  liquidationLeftFields,
} from "../../../handlers/columnHeaders";
import ActionButtons from "../../ui/buttons/ActionButtons";
import LiquidApprovalTable from "../team-leader/liquidation/LiquidApprovalTable";
import PrintableLiquidForm from "../../print/PrintableLiquidForm";
import LiquidationReceipt from "../team-leader/liquidation/LiquidationReceipt";
import { normalizeBase64Image } from "../../../utils/image";
import Reference from "../../Reference";

const AdminLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // COMBINE RECEIPTS
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

  // POPULATE TRANSACTIONS AND TOTAL
  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  // APPROVE
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Admin";

      const payload = {
        id: data?.id,
        status: "completed",
        remarks: "",
        created_by: employeeName,
      };

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to mark liquidation as completed");
      await res.json();

      navigate(-1);
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // REJECT
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

      navigate(-1);
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  // INFO FIELDS
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
                {data?.[key] != null && !isNaN(Number(data[key]))
                  ? `₱${Number(data[key]).toLocaleString("en-PH", {
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
          onApprove={handleApprove}
          onReject={handleReject}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          approveLabel="Mark Completed"
          status={data?.status}
          role="admin"
        />

        <Row className="g-3">
          <Col md={9}>
            <div className="custom-container border p-3">
              {renderInfoFields()}
            </div>

            <LiquidApprovalTable transactions={transactions} total={total} />

            <LiquidationReceipt
              images={receiptImages}
              remarks={data?.remarks}
            />
          </Col>
          <Col md={3}>
            <div
              className="trash-wrapper"
              style={{
                height: "80vh",
                overflowY: "auto",
                position: "sticky",
                top: 0,
              }}
            >
              <Reference items={data?.liquidation_items || []} />
            </div>
          </Col>
        </Row>
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>
    </>
  );
};

export default AdminLiquidForm;
