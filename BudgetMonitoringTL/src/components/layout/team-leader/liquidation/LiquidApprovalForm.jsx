import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import { normalizeBase64Image } from "../../../../utils/image";
import { showSwal } from "../../../../utils/swal";
import ActionButtons from "../../../ui/buttons/ActionButtons";
import LiquidApprovalTable from "./LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "./LiquidationReceipt";
import Reference from "../../../Reference";

const LiquidApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // FETCH ACTIVITIES
  useEffect(() => {
    if (!data?.id) return;

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api5012/liquidation_activity/getliquidation_activity_by_id?id=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        setActivities(result || []);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    fetchActivities();
  }, [data?.id]);

  // FETCH LIQUIDATION ITEMS
  useEffect(() => {
    if (!data?.id) return;

    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api5012/liquidation_item/getliquidation_item_by_id?id=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const text = await res.text();
        const result = JSON.parse(text);
        setTransactions(result || []);
        setTotal(
          (result || []).reduce(
            (sum, item) => sum + parseFloat(item.amount || 0),
            0
          )
        );
      } catch (err) {
        console.error("Error fetching liquidation items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [data?.id]);

  // COMBINE RECEIPTS FROM DATA + ACTIVITIES
  const receiptImages = useMemo(() => {
    const requesterReceipts = [
      ...(Array.isArray(data?.receipts)
        ? data.receipts
        : data?.receipts
        ? [data.receipts]
        : []),
      ...(Array.isArray(activities)
        ? activities.flatMap((act) => {
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
  }, [data, activities]);

  // REMARKS
  const remarks = useMemo(() => {
    if (!Array.isArray(activities) || activities.length === 0)
      return data?.remarks || "";

    const approvedActivity = activities.find(
      (act) => act.action?.toLowerCase() === "approved"
    );

    return approvedActivity?.remarks || data?.remarks || "";
  }, [activities, data?.remarks]);

  const getReimburseReturnLabel = () => {
    const obtained = parseFloat(data?.amount_obtained) || 0;
    const expended = parseFloat(data?.amount_expended) || 0;
    if (expended < obtained) return "Return";
    if (expended > obtained) return "Reimburse";
    return "Reimburse/Return";
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Unknown";

      const payload = {
        id: data?.id,
        status: "approved",
        remarks,
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

      if (!res.ok) throw new Error("Failed to approve liquidation");

      showSwal({
        icon: "success",
        title: "Approved",
        text: "Liquidation approved successfully",
      });

      navigate(-1);
    } catch (err) {
      console.error("Approve error:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Failed to approve liquidation",
      });
    }
  };

  const handleReject = async (remarksText) => {
    if (!remarksText) return;

    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Unknown";

      const payload = {
        id: data?.id,
        status: "rejected",
        remarks: remarksText,
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

      if (!res.ok) throw new Error("Failed to reject liquidation");

      showSwal({
        icon: "success",
        title: "Rejected",
        text: "Liquidation rejected successfully",
      });

      navigate(-1);
    } catch (err) {
      console.error("Reject error:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Failed to reject liquidation",
      });
    }
  };

  const renderInfoFields = () => (
    <Row>
      {[0, 1, 2].map((idx) => {
        const leftField = liquidationLeftFields[idx];
        const rightField = liquidationRightFields[idx];
        const isAmountObtained = rightField?.key === "amount_obtained";
        const referenceValue = isAmountObtained
          ? data?.reference_id ?? "N/A"
          : null;

        return (
          <Row key={idx} className="mb-2">
            {/* Employee / Department / Date */}
            <Col md={4} className="d-flex align-items-center">
              <strong className="title">{leftField?.label}:</strong>
              <p className="ms-2 mb-0">{data?.[leftField?.key] ?? "N/A"}</p>
            </Col>

            {/* Amount Obtained / Expended / Return */}
            <Col md={4} className="d-flex align-items-center">
              <strong className="title">
                {rightField?.key === "reimburse_return"
                  ? getReimburseReturnLabel()
                  : rightField?.label}
                :
              </strong>
              <p className="ms-2 mb-0">
                {data?.[rightField?.key] != null &&
                !isNaN(Number(data[rightField?.key]))
                  ? `₱${Number(data[rightField?.key]).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}`
                  : data?.[rightField?.key] ?? "N/A"}
              </p>
            </Col>

            {/* Reference ID (only for first row) */}
            <Col md={4} className="d-flex align-items-center">
              {isAmountObtained && (
                <>
                  <strong className="title">Reference ID:</strong>
                  <p className="ms-2 mb-0">{referenceValue}</p>
                </>
              )}
            </Col>
          </Row>
        );
      })}
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
          status={data?.status}
          role={localStorage.getItem("role") || "teamlead"}
          printRequestLabel="Print"
          formType="liquidation"
        />

        <Row className="g-3">
          <Col md={9}>
            <div className="custom-container border p-3">
              {renderInfoFields()}
            </div>

            <LiquidApprovalTable transactions={transactions} total={total} />

            {loading && <Spinner animation="border" />}

            <LiquidationReceipt images={receiptImages} remarks={remarks} />
          </Col>

          <Col md={3}>
            <div
              style={{
                height: "80vh",
                overflowY: "auto",
                position: "sticky",
                top: 0,
              }}
            >
              <Reference items={transactions} />
            </div>
          </Col>
        </Row>
      </Container>

      <div className="d-none">
        <PrintableLiquidForm
          data={{
            ...data,
            liquidation_items: transactions,
            total_amount: total,
            receipts: receiptImages,
            remarks: remarks,
          }}
          contentRef={contentRef}
        />
      </div>
    </>
  );
};

export default LiquidApprovalForm;
