import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Modal } from "react-bootstrap";
import {
  approvalFormFields,
  approvalPartnerFields,
} from "../handlers/columnHeaders";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../utils/numberToWords";
import PrintableCashRequest from "./print/PrintableCashRequest";
import CashApprovalTable from "./layout/team-leader/cash-request/CashApprovalTable";
import SignatureUpload from "./SignatureUpload";
import CashReqActionButtons from "./CashReqActionButtons";
import LiqFormModal from "./ui/modal/employee/LiqFormModal";
import ProgressBar from "./layout/ProgressBar";
import AppButton from "./ui/AppButton";
import { progressSteps } from "../handlers/actionMenuItems";
import { normalizeBase64Image } from "../utils/signature";

const ViewCashRequestForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const [particulars, setParticulars] = useState([]);
  const [amountInWords, setAmountInWords] = useState("");
  const [signatures, setSignatures] = useState({
    requestedName: "",
    requestSignature: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);

  const transactions = useMemo(() => data?.cash_request_items || [], [data]);
  const total = useMemo(() => parseFloat(data?.subtotal || 0), [data]);

  useEffect(() => {
    const requestedActivity = data?.cash_request_activities?.find(
      (a) => a.action === "REQUESTED"
    );
    const sig = normalizeBase64Image(requestedActivity?.signature);

    setSignatures({
      requestedName: requestedActivity?.requested_by || "",
      requestSignature: sig,
    });
  }, [data]);

  useEffect(() => {
    const items = transactions.map((item) => ({
      label: item.label ?? "N/A",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      amount: item.subtotal ?? (item.quantity ?? 0) * (item.price ?? 0),
    }));
    setParticulars(items);
  }, [transactions]);

  useEffect(() => {
    if (!isNaN(total)) setAmountInWords(numberToWords(total));
  }, [total]);

  const currentStep = useMemo(() => {
    switch (data?.status) {
      case "completed":
        return 4;
      case "disbursed":
        return 3;
      case "approved":
        return 2;
      case "review":
        return 1;
      default:
        return 0;
    }
  }, [data]);

  const handleStepClick = (index, step) =>
    console.log("Clicked step:", step.label);

  return (
    <div className="pb-3">
      <Container fluid>
        <CashReqActionButtons
          onBack={() => navigate(-1)}
          onView={() => setShowModal(true)}
          onPrint={useReactToPrint({ contentRef })}
          onShowLiqFormModal={() => setShowLiqFormModal(true)}
        />

        <LiqFormModal
          show={showLiqFormModal}
          onHide={() => setShowLiqFormModal(false)}
          onSubmit={(liqData) => {
            const existing =
              JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];
            localStorage.setItem(
              LOCAL_KEYS.LIQUIDATION,
              JSON.stringify([
                {
                  ...liqData,
                  formType: "Liquidation",
                  createdAt: new Date().toISOString(),
                },
                ...existing,
              ])
            );
            window.dispatchEvent(new Event("liquidations-updated"));
            setShowLiqFormModal(false);
          }}
        />

        {/* PROGRESS BAR */}
        <div className="request-container border p-2 mb-3">
          <Row className="align-items-center d-flex justify-content-between">
            <Col className="d-flex">
              <ProgressBar
                steps={progressSteps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </Col>
          </Row>
        </div>

        {/* Request Info */}
        <div className="custom-container border p-3">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Description:</strong>
              <p className="ms-md-2 mb-0 text-start">
                {data?.description || "N/A"}
              </p>
            </Col>
          </Row>

          {/* Partner Fields */}
          <Row>
            {approvalPartnerFields.map(({ label, key }, idx) => (
              <Col
                key={idx}
                xs={12}
                md={6}
                className="d-flex align-items-center mb-2"
              >
                <strong className="title">{label}:</strong>
                <p className="ms-2 mb-0">
                  {key === "total"
                    ? `₱${parseFloat(data?.[key] || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : data?.[key] || "N/A"}
                </p>
              </Col>
            ))}
          </Row>

          {/* Employee Fields */}
          {approvalFormFields.map(({ label, key }, idx) => (
            <Row key={idx}>
              <Col xs={12} className="d-flex align-items-center mb-2">
                <strong className="title">{label}:</strong>
                <p className="ms-2 mb-0">
                  {key === "subtotal"
                    ? `₱${parseFloat(data?.[key] || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : data?.[key] || "N/A"}
                </p>
              </Col>
            </Row>
          ))}

          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Amount in Words:</strong>
              <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <CashApprovalTable transactions={transactions} subtotal={total} />

        {/* Signatures */}
        <SignatureUpload
          label="Requested by"
          nameKey="requestedName"
          signatureKey="requestSignature"
          signatures={signatures}
          setSignatures={setSignatures}
          readOnly={true}
        />
      </Container>

      {/* Hidden Printable Component */}
      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        ref={contentRef}
      >
        <PrintableCashRequest
          data={{ ...data, items: transactions }}
          amountInWords={amountInWords}
          signatures={signatures}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Body>
          <PrintableCashRequest
            data={{ ...data, items: transactions }}
            amountInWords={amountInWords}
            signatures={signatures}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewCashRequestForm;
