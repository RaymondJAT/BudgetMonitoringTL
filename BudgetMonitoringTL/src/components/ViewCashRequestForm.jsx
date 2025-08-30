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

const ViewCashRequestForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const [particulars, setParticulars] = useState([]);
  const [amountInWords, setAmountInWords] = useState("");
  const [signatures, setSignatures] = useState(
    data?.signatures || {
      approved: null,
      approvedName: "",
    }
  );

  const [showModal, setShowModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const transactions = useMemo(() => data?.transactions || [], [data]);

  const total = useMemo(() => {
    return transactions.reduce(
      (sum, row) => sum + (row.quantity ?? 0) * (row.price ?? 0),
      0
    );
  }, [transactions]);

  useEffect(() => {
    const items = transactions.map((item) => ({
      label: item.label ?? "N/A",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      amount: (item.quantity ?? 0) * (item.price ?? 0),
    }));
    setParticulars(items);
  }, [transactions]);

  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total]);

  const renderPartnerFields = () => (
    <Row>
      {approvalPartnerFields.map(({ label, key }, index) => (
        <Col
          key={index}
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
  );

  const renderEmployeeFields = () =>
    approvalFormFields.map(({ label, key }, index) => {
      const value = data?.[key];
      const isCurrency =
        typeof value === "number" || key.toLowerCase().includes("amount");

      return (
        <Row key={index}>
          <Col xs={12} className="d-flex align-items-center mb-2">
            <strong className="title">{label}:</strong>
            <p className="ms-2 mb-0">
              {isCurrency
                ? `₱${parseFloat(value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`
                : value || "N/A"}
            </p>
          </Col>
        </Row>
      );
    });

  const getCurrentStep = () => {
    if (data?.status === "completed") return 4;
    if (data?.status === "disbursed") return 3;
    if (data?.status === "approved") return 2;
    if (data?.status === "review") return 1;
    return 0; // submitted
  };

  const currentStep = getCurrentStep();

  const handleStepClick = (index, step) => {
    console.log("Clicked step:", step.label);
  };

  return (
    <div className="pb-3">
      <Container fluid>
        <CashReqActionButtons
          onBack={() => navigate(-1)}
          onView={handleOpenModal}
          onPrint={reactToPrintFn}
          onShowLiqFormModal={() => setShowLiqFormModal(true)}
        />

        <LiqFormModal
          show={showLiqFormModal}
          onHide={() => setShowLiqFormModal(false)}
          onSubmit={(liqData) => {
            const existing =
              JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];

            const newEntry = {
              ...liqData,
              formType: "Liquidation",
              createdAt: new Date().toISOString(),
            };

            localStorage.setItem(
              LOCAL_KEYS.LIQUIDATION,
              JSON.stringify([newEntry, ...existing])
            );

            window.dispatchEvent(new Event("liquidations-updated"));
            setShowLiqFormModal(false);
          }}
        />

        {/* PROGRESS BAR  */}
        <div className="request-container border p-2 mb-3">
          <Row className="align-items-center d-flex justify-content-between">
            {/* ProgressBar */}
            <Col className="d-flex">
              <ProgressBar
                steps={progressSteps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </Col>

            {/* Button */}
            <Col className="d-flex">
              <AppButton
                label="Mark"
                variant="outline-dark"
                className="custom-app-button"
                style={{ minWidth: "100px" }}
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

          {renderPartnerFields()}
          {renderEmployeeFields()}

          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Amount in Words:</strong>
              <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <CashApprovalTable transactions={transactions} total={total} />

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
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={contentRef}>
          <PrintableCashRequest
            data={{ ...data, items: particulars }}
            amountInWords={amountInWords}
            signatures={signatures}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Body>
          <PrintableCashRequest
            data={{ ...data, items: particulars }}
            amountInWords={amountInWords}
            signatures={signatures}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewCashRequestForm;
