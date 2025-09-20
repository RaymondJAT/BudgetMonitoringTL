import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ui/buttons/ActionButtons";
import LiquidApprovalTable from "./LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "./LiquidationReceipt";
import Reference from "../../../Reference";
import { normalizeBase64Image } from "../../../../utils/image";

const LiquidApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [apiReceipts, setApiReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [errorReceipts, setErrorReceipts] = useState(null);
  const [remarks, setRemarks] = useState("");

  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    console.log("✅ LiquidApprovalForm received data from navigation:", data);
  }, [data]);

  // FETCH RECEIPTS
  useEffect(() => {
    if (!data?.id) return;

    const fetchReceipts = async () => {
      setLoadingReceipts(true);
      setErrorReceipts(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api5012/liquidation/getcash_liquidation_id?id=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch receipts");
        const result = await res.json();

        console.log("API response for receipts:", result);

        if (result[0]?.remarks) {
          setRemarks(result[0].remarks);
        }

        const parsedReceipts = result.flatMap((r) => {
          try {
            const arr = JSON.parse(r.receipts);
            return Array.isArray(arr)
              ? arr.map((x) => normalizeBase64Image(x.image || x))
              : [normalizeBase64Image(r.receipts)];
          } catch {
            return [normalizeBase64Image(r.receipts)];
          }
        });

        setApiReceipts(parsedReceipts);
      } catch (err) {
        console.error("Error fetching receipts:", err);
        setErrorReceipts(err.message || "Failed to load receipts");
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchReceipts();
  }, [data]);

  const receiptImages = useMemo(() => apiReceipts, [apiReceipts]);

  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = parseInt(localStorage.getItem("employee_id"), 10) || 0;

      const status = action === "approve" ? "approved" : "rejected";
      let remarks = "";

      if (action === "reject") {
        remarks = prompt("Enter remarks for rejection:") || "";
      }

      const payload = {
        id: data?.id,
        status,
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

      if (!res.ok) throw new Error("Failed to update liquidation");

      const response = await res.json();
      console.log("Update response:", response);

      navigate(-1);
    } catch (err) {
      console.error("Error in handleAction:", err);
    }
  };

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
          onApprove={() => handleAction("approve")}
          onReject={() => handleAction("reject")}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          status={data?.status}
          role={localStorage.getItem("role") || "teamlead"}
        />

        <Row className="g-3">
          {/* LEFT COLUMN */}
          <Col md={9}>
            <div className="custom-container border p-3">
              {renderInfoFields()}
            </div>

            <LiquidApprovalTable transactions={transactions} total={total} />

            {loadingReceipts && <Spinner animation="border" />}

            <LiquidationReceipt images={receiptImages} remarks={remarks} />
          </Col>

          {/* RIGHT COLUMN */}
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

export default LiquidApprovalForm;
