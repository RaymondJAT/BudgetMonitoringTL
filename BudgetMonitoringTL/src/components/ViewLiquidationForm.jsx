import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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

  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);

    const computedTotal = items.reduce(
      (sum, item) => sum + (item.amount ?? 0),
      0
    );
    setTotal(computedTotal);
  }, [data]);

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
    <div className="pb-3">
      <Container fluid>
        {/* Only Back + Print */}
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
        <LiquidationReceipt
          images={
            Array.isArray(data?.receipts)
              ? data.receipts.map(normalizeBase64Image)
              : data?.receipts
              ? [normalizeBase64Image(data.receipts)]
              : []
          }
        />

        {/* Signatures (read-only mode) */}
        <SignatureUpload
          label="Noted by"
          nameKey="verifiedName"
          signatureKey="verified"
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
