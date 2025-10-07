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
  const [apiReceipts, setApiReceipts] = useState([]);
  const [newReceipts, setNewReceipts] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchReceipts = useCallback(async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api5012/liquidation/getcash_liquidation_id?id=${data.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch receipts");

      const receiptData = await res.json();

      const parsedReceipts = receiptData.flatMap((entry) => {
        if (!entry.receipts) return [];
        try {
          const arr = JSON.parse(entry.receipts);
          return Array.isArray(arr)
            ? arr.map((r) => normalizeBase64Image(r.image || r))
            : [normalizeBase64Image(entry.receipts)];
        } catch {
          return [normalizeBase64Image(entry.receipts)];
        }
      });

      setApiReceipts(parsedReceipts);

      if (receiptData.length > 0) {
        const liquidationData = receiptData[0];

        if (liquidationData.remarks) {
          setRemarks(liquidationData.remarks);
        }

        if (liquidationData.liquidation_items) {
          setData(liquidationData);
          setTransactions(liquidationData.liquidation_items);
          setTotal(
            liquidationData.liquidation_items.reduce((sum, item) => {
              const val = parseFloat(item.amount);
              return sum + (isNaN(val) ? 0 : val);
            }, 0)
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [data?.id]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // POPULATE TRANSACTIONS AND TOTAL
  useEffect(() => {
    if (!data) return;
    const items = data.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

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
        {liquidationRightFields.map(({ label, key }, idx) => {
          const dynamicLabel =
            key === "reimburse_return" ? getReimburseReturnLabel() : label;

          return (
            <Row key={idx} className="mb-2">
              <Col xs={12} className="d-flex align-items-center">
                <strong className="title">{dynamicLabel}:</strong>
                <p className="ms-2 mb-0">
                  {data?.[key] != null && !isNaN(Number(data[key]))
                    ? `₱${Number(data[key]).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}`
                    : data?.[key] ?? "N/A"}
                </p>
              </Col>
            </Row>
          );
        })}
      </Col>
    </Row>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" /> <span className="ms-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  const getReimburseReturnLabel = () => {
    const obtained = parseFloat(data?.amount_obtained) || 0;
    const expended = parseFloat(data?.amount_expended) || 0;

    if (expended < obtained) return "Return";
    if (expended > obtained) return "Reimburse";
    return "Reimburse/Return";
  };

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

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          remarks={remarks}
          setNewReceipts={handleReceiptsChange}
        />
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
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
          setTimeout(fetchReceipts, 1000);
        }}
      />
    </div>
  );
};

export default ViewLiquidationForm;
