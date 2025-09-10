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
import SignatureUpload from "./SignatureUpload";
import { normalizeBase64Image } from "../utils/signature";
import ActionButtons from "./ActionButtons";

const ViewLiquidationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [data, setData] = useState(state || null);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  const [signatures, setSignatures] = useState({
    created_by: state?.created_by || state?.employee || "",
    signature: normalizeBase64Image(state?.signature),
  });

  const reactToPrintFn = useReactToPrint({ contentRef });

  // -----------------------------
  // Fetch liquidation if only reference_id is provided
  // -----------------------------
  useEffect(() => {
    const fetchLiquidation = async () => {
      if (!state?.reference_id || state?.employee) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`/api5012/liquidation/${state.reference_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch liquidation data");

        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidation();
  }, [state]);

  // -----------------------------
  // Populate transactions and total whenever data changes
  // -----------------------------
  useEffect(() => {
    if (!data) return;

    const items = data.liquidation_items || [];
    setTransactions(items);

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setTotal(totalAmount);

    // Set signature from PREPARED activity or fallback
    const preparedActivity = data.liquidation_activities?.find(
      (act) => act.action === "PREPARED"
    );

    setSignatures({
      created_by:
        preparedActivity?.created_by ||
        data.created_by ||
        data.employee ||
        state?.employee ||
        "",
      signature: normalizeBase64Image(
        preparedActivity?.signature || data.signature || state?.signature
      ),
    });
  }, [data, state?.employee, state?.signature]);

  // -----------------------------
  // Render info fields
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

  // -----------------------------
  // Parse receipts
  // -----------------------------
  const receiptImages = useMemo(() => {
    if (!Array.isArray(data?.liquidation_activities)) return [];

    return data.liquidation_activities
      .filter((act) => act.receipts)
      .flatMap((act) => {
        try {
          const parsed = JSON.parse(act.receipts);
          if (Array.isArray(parsed))
            return parsed.map((r) => normalizeBase64Image(r.image || r));
        } catch {
          return [normalizeBase64Image(act.receipts)];
        }
        return [];
      });
  }, [data]);

  // -----------------------------
  // Loading / Error states
  // -----------------------------
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

  // -----------------------------
  // Render main
  // -----------------------------
  return (
    <div className="pb-3">
      <Container fluid>
        {/* Back + Print only */}
        <ActionButtons
          onBack={() => navigate(-1)}
          onPrint={reactToPrintFn}
          hideApproveReject
        />

        {/* Info Fields */}
        <div className="custom-container border p-3">{renderInfoFields()}</div>

        {/* Transactions Table */}
        <LiquidApprovalTable transactions={transactions} total={total} />

        {/* Receipts */}
        <LiquidationReceipt images={receiptImages} />

        {/* Prepared by Signature */}
        <SignatureUpload
          label="Prepared by"
          nameKey="created_by"
          signatureKey="signature"
          signatures={signatures}
          setSignatures={setSignatures}
          readOnly
        />
      </Container>

      {/* Printable */}
      <div className="d-none">
        <PrintableLiquidForm
          data={{ ...data }}
          contentRef={contentRef}
          signatures={signatures}
        />
      </div>
    </div>
  );
};

export default ViewLiquidationForm;
