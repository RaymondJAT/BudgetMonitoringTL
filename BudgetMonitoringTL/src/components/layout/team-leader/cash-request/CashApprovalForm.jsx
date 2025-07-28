import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  approvalFormFields,
  approvalPartnerFields,
} from "../../../../handlers/columnHeaders";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../../../../utils/numberToWords";
import { mockData } from "../../../../handlers/mockData";
import { toast } from "react-toastify";
import PrintableCashRequest from "../../../print/PrintableCashRequest";
import CashApprovalTable from "./CashApprovalTable";
import ActionButtons from "../../../ActionButtons";
import SignatureUpload from "../../../SignatureUpload";

const CashApprovalForm = () => {
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

  // const employeeData = mockData.find((e) => e.employee === data?.employee) || {
  //   transactions: [],
  // };
  // const transactions = employeeData.transactions;
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

  const moveToTrash = (entry) => {
    const trashData = JSON.parse(localStorage.getItem("trashData") || "[]");
    localStorage.setItem("trashData", JSON.stringify([...trashData, entry]));
  };

  const markAsImportant = (entry) => {
    const importantData = JSON.parse(
      localStorage.getItem("importantData") || "[]"
    );
    localStorage.setItem(
      "importantData",
      JSON.stringify([...importantData, entry])
    );
  };

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
    <div className="pb-3">
      <Container fluid>
        {/* ACTION BUTTON */}
        <ActionButtons
          onApprove={() => {
            /* approval logic */
          }}
          onReject={() => {
            /* rejection logic */
          }}
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
        {/* Info Fields */}
        <div className="custom-container border p-3 ">
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
        {/* TABLE */}
        <CashApprovalTable transactions={transactions} total={total} />
        {/* SIGNATURE UPLOAD */}
        <SignatureUpload
          label="Approved by"
          nameKey="approvedName"
          signatureKey="approved"
          signatures={signatures}
          setSignatures={setSignatures}
        />
      </Container>
      {/* HIDDEN PRINTABLE */}
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

export default CashApprovalForm;
