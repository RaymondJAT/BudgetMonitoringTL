import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ActionButtons";
import SignatureUpload from "../../../SignatureUpload";
import LiquidApprovalTable from "./LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "./LiquidationReceipt";

import { mockLiquidationData } from "../../../../handlers/liquidData";

const LiquidApprovalForm = () => {
  // const { state: data } = useLocation();
  const data = mockLiquidationData[0];
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [particulars, setParticulars] = useState([]);
  const [total, setTotal] = useState(0);
  const [signatures, setSignatures] = useState({
    verified: null,
    verifiedName: "",
  });

  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    const items = data?.transactions || [];
    setTransactions(items);

    const computedItems = items.map((item) => ({
      ...item,
      amount: item.amount ?? 0,
    }));

    setParticulars(computedItems);

    const totalAmount = computedItems.reduce(
      (sum, item) => sum + (item.amount ?? 0),
      0
    );

    setTotal(totalAmount);
  }, [data]);

  const markAsImportant = (entry) => {
    const importantData = JSON.parse(
      localStorage.getItem("importantData") || "[]"
    );
    localStorage.setItem(
      "importantData",
      JSON.stringify([...importantData, entry])
    );
  };

  const moveToTrash = (entry) => {
    const trashData = JSON.parse(localStorage.getItem("trashData") || "[]");
    localStorage.setItem("trashData", JSON.stringify([...trashData, entry]));
  };

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
        {/* ACTION BUTTON */}
        <ActionButtons
          onApprove={() => {}}
          onReject={() => {}}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          onImportant={() => {
            markAsImportant(data);
            toast.success("Entry marked as important.");
          }}
          onDelete={() => {
            moveToTrash(data);
            navigate(-1);
            toast.success("Entry moved to trash.");
          }}
        />

        {/* INFO FIELDS */}
        <div className="custom-container border p-3 bg-white">
          {renderInfoFields()}
        </div>

        {/* TABLE */}
        <LiquidApprovalTable transactions={transactions} total={total} />
        {/* IMAGE CONTAINER */}
        <LiquidationReceipt
          images={Array.isArray(data?.proofImages) ? data.proofImages : []}
        />
        {/* SIGNATURE */}
        <SignatureUpload
          label="Verified by"
          nameKey="verifiedName"
          signatureKey="verified"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </Container>
      {/* PRINTABLE */}
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

export default LiquidApprovalForm;
