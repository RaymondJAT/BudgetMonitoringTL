import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  approvalFormFields,
  approvalPartnerFields,
} from "../../../../handlers/columnHeaders";
import { useReactToPrint } from "react-to-print";
import { numberToWords } from "../../../../utils/numberToWords";
import { toast } from "react-toastify";
import PrintableCashRequest from "../../../print/PrintableCashRequest";
import CashApprovalTable from "../../team-leader/cash-request/CashApprovalTable";
import ActionButtons from "../../../ActionButtons";
import SignatureUpload from "../../../SignatureUpload";
import Reference from "../../../Reference";

const FinanceApprovalForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const [amountInWords, setAmountInWords] = useState("");
  const [signatures, setSignatures] = useState(
    data?.signatures || { financeApproved: null, financeName: "" }
  );

  const reactToPrintFn = useReactToPrint({ contentRef });

  const transactions = useMemo(() => data?.cash_request_items || [], [data]);
  const total = useMemo(() => parseFloat(data?.subtotal || 0), [data]);

  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total]);

  // API CALL
  const handleUpdateRequest = async (status, remarks = "") => {
    try {
      const payload = {
        status,
        id: data?.id,
        remarks,
        signature: signatures.financeApproved,
        updated_by: signatures.financeName || "Finance",
      };

      const res = await fetch("/api5012/cash_request/updatecash_request", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update request");

      toast.success(
        `Cash request ${
          status === "completed" ? "completed" : "rejected"
        } by Finance`
      );

      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating.");
    }
  };

  return (
    <div className="pb-3">
      <Container fluid>
        {/* ACTION BUTTONS */}
        <ActionButtons
          onApprove={() => handleUpdateRequest("completed")}
          onReject={() => {
            const remarks = prompt("Enter remarks for rejection:");
            if (remarks !== null) {
              handleUpdateRequest("rejected", remarks);
            }
          }}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
        />

        <Row>
          <Col md={9} className="d-flex flex-column pe-md-2">
            {/* INFO FIELDS */}
            <div className="custom-container border p-3">
              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Description:</strong>
                  <p className="ms-md-2 mb-0 text-start">
                    {data?.description || "N/A"}
                  </p>
                </Col>
              </Row>

              {/* PARTNER FIELDS */}
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
                        ? `₱${parseFloat(data?.[key] || 0).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}`
                        : data?.[key] || "N/A"}
                    </p>
                  </Col>
                ))}
              </Row>

              {/* EMPLOYEE FIELDS */}
              {approvalFormFields.map(({ label, key }, index) => (
                <Row key={index}>
                  <Col xs={12} className="d-flex align-items-center mb-2">
                    <strong className="title">{label}:</strong>
                    <p className="ms-2 mb-0">
                      {key === "subtotal"
                        ? `₱${parseFloat(data?.[key] || 0).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}`
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

            {/* TABLE */}
            <CashApprovalTable transactions={transactions} subtotal={total} />

            {/* SIGNATURE */}
            <SignatureUpload
              label="Approved by"
              nameKey="financeName"
              signatureKey="financeApproved"
              signatures={signatures}
              setSignatures={setSignatures}
            />
          </Col>

          <Col md={3} className="ps-md-2">
            <Reference data={data} />
          </Col>
        </Row>
      </Container>

      {/* PRINTABLE HIDDEN */}
      <div className="d-none">
        <PrintableCashRequest
          data={{ ...data, items: transactions }}
          amountInWords={amountInWords}
          signatures={signatures}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
};

export default FinanceApprovalForm;
