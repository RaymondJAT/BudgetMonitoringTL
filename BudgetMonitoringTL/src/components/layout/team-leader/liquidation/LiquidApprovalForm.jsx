import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ActionButtons";
import LiquidApprovalTable from "./LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "./LiquidationReceipt";
import { normalizeBase64Image } from "../../../../utils/image";

const LiquidApprovalForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [newReceipts, setNewReceipts] = useState([]);
  const [apiReceipts, setApiReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [errorReceipts, setErrorReceipts] = useState(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

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
    setNewReceipts(base64List);
  };

  // Fetch receipts from the new API
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
        console.error(err);
        setErrorReceipts(err.message || "Failed to load receipts");
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchReceipts();
  }, [data]);

  // Combine API receipts and new uploads
  const receiptImages = useMemo(() => {
    return Array.from(new Set([...apiReceipts, ...newReceipts]));
  }, [apiReceipts, newReceipts]);

  // Populate transactions and total
  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.amount ?? 0),
      0
    );
    setTotal(totalAmount);
  }, [data]);

  // Approve / Reject action
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
        ...(newReceipts.length > 0 && {
          receipts: JSON.stringify(newReceipts),
        }),
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

      await res.json();
      alert(`Liquidation ${status} successfully!`);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  // Render info fields
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

        {loadingReceipts && <Spinner animation="border" />}
        {errorReceipts && <Alert variant="danger">{errorReceipts}</Alert>}

        <LiquidationReceipt
          images={receiptImages}
          setNewReceipts={handleReceiptsChange}
        />
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>
    </>
  );
};

export default LiquidApprovalForm;
