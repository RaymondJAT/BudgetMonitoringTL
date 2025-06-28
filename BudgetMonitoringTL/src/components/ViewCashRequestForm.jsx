import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  approvalFormFields,
  approvalPartnerFields,
} from "../handlers/columnHeaders";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../utils/numberToWords";
import { FaArrowLeft } from "react-icons/fa";
import PrintableCashRequest from "./print/PrintableCashRequest";
import CashApprovalTable from "./layout/team-leader/cash-request/CashApprovalTable";
import SignatureUpload from "./SignatureUpload";
import AppButton from "./ui/AppButton";

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

  return (
    <div className="mt-3">
      <Container fluid>
        <AppButton
          variant="dark"
          size="sm"
          onClick={() => navigate(-1)}
          className="custom-button btn-responsive mb-3"
        >
          <FaArrowLeft />
        </AppButton>
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
      <div className="d-none">
        <PrintableCashRequest
          data={{ ...data, items: particulars }}
          amountInWords={amountInWords}
          contentRef={contentRef}
          signatures={signatures}
        />
      </div>
    </div>
  );
};

export default ViewCashRequestForm;
