import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../handlers/columnHeaders";
import LiquidApprovalTable from "./layout/team-leader/liquidation/LiquidApprovalTable";
import PrintableLiquidForm from "./print/PrintableLiquidForm";
import LiquidationReceipt from "./layout/team-leader/liquidation/LiquidationReceipt";
import { normalizeBase64Image } from "../utils/image";
import ActionButtons from "./ui/buttons/ActionButtons";
import EditLiquidation from "./ui/modal/employee/EditLiquidation";

const ViewLiquidationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [data, setData] = useState(state || null);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [activities, setActivities] = useState([]);
  const [apiReceipts, setApiReceipts] = useState([]);
  const [newReceipts, setNewReceipts] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  // Find rejected or latest remarks from activities
  const activityRemark = useMemo(() => {
    if (!activities?.length) return null;

    // Prefer "REJECTED" remarks if present
    const rejected = activities.find((act) => act.action === "REJECTED");
    if (rejected?.remarks) return rejected.remarks;

    // Otherwise use the latest non-empty remarks
    const latestWithRemark = [...activities]
      .reverse()
      .find((act) => act.remarks && act.remarks.trim() !== "");
    return latestWithRemark?.remarks || remarks || null;
  }, [activities, remarks]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // FETCH ITEMS AND ACTIVITIES
  const fetchLiquidationData = useCallback(async () => {
    if (!data?.id) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // FETCH
      const itemsRes = await fetch(
        `/api5012/liquidation_item/getliquidation_item_by_id?id=${data.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const itemsText = await itemsRes.text();
      const itemsData = itemsRes.ok ? JSON.parse(itemsText) : [];
      setTransactions(itemsData || []);
      setTotal(
        (itemsData || []).reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0
        )
      );

      // ACTIVITIES
      const actRes = await fetch(
        `/api5012/liquidation_activity/getliquidation_activity_by_id?id=${data.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const actData = actRes.ok ? await actRes.json() : [];
      setActivities(actData || []);

      // COMBINE RECEIPTS FROM BOTH ACTIVITIES AND DATA
      const requesterReceipts = [
        ...(Array.isArray(data?.receipts)
          ? data.receipts
          : data?.receipts
          ? [data.receipts]
          : []),
        ...(Array.isArray(actData)
          ? actData.flatMap((act) => {
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

      setApiReceipts(Array.from(new Set(requesterReceipts)));

      // SET REMARKS
      const remarkText =
        data?.remarks || (Array.isArray(actData) && actData[0]?.remarks) || "";
      setRemarks(remarkText);
    } catch (err) {
      console.error("Error fetching liquidation data:", err);
      setError(err.message || "Failed to fetch liquidation data");
    } finally {
      setLoading(false);
    }
  }, [data?.id, data?.receipts]);

  useEffect(() => {
    fetchLiquidationData();
  }, [fetchLiquidationData]);

  // HANDLE NEW UPLOAD RECEIPTS
  const handleReceiptsChange = async (files) => {
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

  // COMBINE RECEIPTS
  const receiptImages = useMemo(
    () => [...apiReceipts, ...newReceipts],
    [apiReceipts, newReceipts]
  );

  const getReimburseReturnLabel = () => {
    const obtained = parseFloat(data?.amount_obtained) || 0;
    const expended = parseFloat(data?.amount_expended) || 0;
    if (expended < obtained) return "Return";
    if (expended > obtained) return "Reimburse";
    return "Reimburse/Return";
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

            {/* Reference ID */}
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" /> <span className="ms-2">Loading...</span>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );

  return (
    <div className="pb-3">
      <Container fluid>
        <ActionButtons
          onBack={() => navigate(-1)}
          onPrint={reactToPrintFn}
          hideApproveReject
          printRequestLabel="Print"
          status={data?.status}
          formType="liquidation"
          onEdit={() => setShowEditModal(true)}
        />

        {/* REMARKS */}
        {data?.status?.toLowerCase() === "rejected" && !!activityRemark && (
          <Row className="mb-3">
            <Col xs={12}>
              <div
                className="p-2 border rounded"
                style={{ borderColor: "#e87272ff", background: "#fff5f5" }}
              >
                <strong
                  className="text-danger me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  Remarks:
                </strong>
                <span className="fw-bold" style={{ fontSize: "0.8rem" }}>
                  {activityRemark}
                </span>
              </div>
            </Col>
          </Row>
        )}

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          remarks={remarks}
          setNewReceipts={handleReceiptsChange}
        />
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

      <EditLiquidation
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        requestData={{
          ...data,
          remarks,
          liquidation_items: transactions,
          receipts: apiReceipts.map((r, idx) =>
            typeof r === "string" ? { id: idx, image: r } : r
          ),
        }}
        onSave={(updatedData) => {
          if (updatedData) {
            setTransactions(updatedData.liquidation_items || []);
            setRemarks(updatedData.remarks || "");
            setApiReceipts(
              (updatedData.receipts || []).map((r) =>
                typeof r === "string" ? r : r.image
              )
            );
            setTotal(
              (updatedData.liquidation_items || []).reduce(
                (sum, item) => sum + (item.amount ?? 0),
                0
              )
            );
          }
          setShowEditModal(false);
          setTimeout(fetchLiquidationData, 1000);
        }}
      />
    </div>
  );
};

export default ViewLiquidationForm;
