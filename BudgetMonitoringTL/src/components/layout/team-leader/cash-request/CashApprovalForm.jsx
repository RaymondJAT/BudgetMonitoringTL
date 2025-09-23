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
import CashApprovalTable from "./CashApprovalTable";
import ActionButtons from "../../../ui/buttons/ActionButtons";

const CashApprovalForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const employeeName =
    localStorage.getItem("employee_fullname") ||
    localStorage.getItem("username") ||
    "";

  const [amountInWords, setAmountInWords] = useState("");

  const total = useMemo(() => parseFloat(data?.amount || 0), [data]);

  useEffect(() => {
    if (!isNaN(total)) setAmountInWords(numberToWords(total));
  }, [total]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleUpdateRequest = async (status, remarks = "") => {
    try {
      const payload = {
        status,
        id: data?.id,
        remarks,
        updated_by: employeeName,
      };

      const res = await fetch("/api5012/cash_request/updatecash_request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update request");

      toast.success(
        `Cash request ${status === "approved" ? "approved" : "rejected"}`
      );
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    }
  };

  return (
    <div className="pb-3">
      <Container fluid>
        {/* Action Buttons */}
        <ActionButtons
          onApprove={() => handleUpdateRequest("approved")}
          onReject={() => {
            const remarks = prompt("Enter remarks for rejection:");
            if (remarks !== null) handleUpdateRequest("rejected", remarks);
          }}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          status={data?.status}
          role="teamlead"
          printRequestLabel="Print"
        />

        <Row>
          <Col md={12} className="d-flex flex-column">
            {/* Details */}
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
                      {key === "amount"
                        ? `₱${parseFloat(total || 0).toLocaleString("en-US", {
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
                      {key === "amount"
                        ? `₱${parseFloat(total || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}`
                        : data?.[key] || "N/A"}
                    </p>
                  </Col>
                </Row>
              ))}

              {/* Amount in Words */}
              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Amount in Words:</strong>
                  <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
                </Col>
              </Row>
            </div>

            {/* Table: Amount + Total */}
            <CashApprovalTable total={total} />
          </Col>
        </Row>
      </Container>

      {/* Printable */}
      <div className="d-none">
        <PrintableCashRequest
          data={{
            ...data,
            description: data?.description,
            total: total,
            items: data?.items || [],
          }}
          amountInWords={amountInWords}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
};

export default CashApprovalForm;
