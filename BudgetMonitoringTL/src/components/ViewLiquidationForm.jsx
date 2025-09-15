import { useEffect, useRef, useState, useMemo } from "react";
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
import ActionButtons from "./ActionButtons";

const ViewLiquidationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [data, setData] = useState(state || null);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [apiReceipts, setApiReceipts] = useState([]);
  const [newReceipts, setNewReceipts] = useState([]);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // Fetch receipts from the server when data.id is available
  useEffect(() => {
    if (!data?.id) return;

    const fetchReceipts = async () => {
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
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [data?.id]);

  // Populate transactions and total
  useEffect(() => {
    if (!data) return;
    const items = data.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  // Handle newly uploaded receipts
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

  // Combine API receipts and newly uploaded receipts
  const receiptImages = useMemo(
    () => [...apiReceipts, ...newReceipts],
    [apiReceipts, newReceipts]
  );

  // Render information fields
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

  return (
    <div className="pb-3">
      <Container fluid>
        <ActionButtons
          onBack={() => navigate(-1)}
          onPrint={reactToPrintFn}
          hideApproveReject
        />

        <div className="custom-container border p-3">{renderInfoFields()}</div>

        <LiquidApprovalTable transactions={transactions} total={total} />

        <LiquidationReceipt
          images={receiptImages}
          setNewReceipts={handleReceiptsChange}
        />
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>
    </div>
  );
};

export default ViewLiquidationForm;
