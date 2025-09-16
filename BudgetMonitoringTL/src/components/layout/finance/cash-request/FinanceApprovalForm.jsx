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
import Reference from "../../../Reference";
import PickRevolvingFund from "../../../ui/modal/admin/PickRevolvingFund";

const FinanceApprovalForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const employeeName =
    localStorage.getItem("employee_fullname") ||
    localStorage.getItem("username") ||
    "";

  const [amountInWords, setAmountInWords] = useState("");
  const [showFundModal, setShowFundModal] = useState(false);

  // ✅ Now use only amount
  const total = useMemo(() => parseFloat(data?.amount || 0), [data]);

  useEffect(() => {
    if (!isNaN(total)) setAmountInWords(numberToWords(total));
  }, [total]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleUpdateRequest = async (
    status,
    remarks = "",
    revolvingFundId = null
  ) => {
    try {
      let cashVoucher = null;
      let departmentId = null;

      if (status === "completed") {
        const resVoucher = await fetch(
          `/api5001/cash_disbursement/getcash_disbursement_cv_number?department=${data?.department}`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (!resVoucher.ok)
          throw new Error("Failed to fetch cash voucher information");
        const voucherData = await resVoucher.json();
        const voucherInfo = voucherData?.data || {};

        cashVoucher = (Number(voucherInfo?.cash_voucher) || 0) + 1;
        departmentId = voucherInfo?.department_id || null;

        await fetch("/api5001/cash_disbursement/createcash_disbursement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            received_by: data?.employee_id || "N/A",
            department_id: departmentId,
            revolving_fund_id: revolvingFundId,
            particulars: data?.description || "N/A",
            amount_issue: parseFloat(data?.amount || 0),
            amount_return: 0,
            cash_voucher: cashVoucher,
          }),
        });
      }

      const payload = {
        status,
        id: data?.id,
        remarks,
        updated_by: employeeName,
        department_name: data?.department_name || "N/A",
        cash_voucher: cashVoucher,
      };

      const res = await fetch("/api5012/cash_request/updatecash_request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update cash request");
      await res.json();

      toast.success(
        `Cash request ${
          status === "completed" ? "completed & disbursed" : "rejected"
        } by Finance`
      );
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while processing approval.");
    }
  };

  return (
    <div className="pb-3">
      <Container fluid>
        {/* ACTION BUTTONS */}
        <ActionButtons
          onApprove={() => setShowFundModal(true)}
          onReject={() => {
            const remarks = prompt("Enter remarks for rejection:");
            if (remarks !== null) handleUpdateRequest("rejected", remarks);
          }}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          status={data?.status}
          role="finance"
        />

        <Row>
          <Col md={9} className="d-flex flex-column pe-md-2">
            {/* DETAILS */}
            <div className="custom-container border p-3">
              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Description:</strong>
                  <p className="ms-md-2 mb-0 text-start">
                    {data?.description || "N/A"}
                  </p>
                </Col>
              </Row>

              {/* FIELDS */}
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

              {/* FIELDS */}
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

              {/* AMOUNT IN WORDS */}
              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Amount in Words:</strong>
                  <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
                </Col>
              </Row>
            </div>

            {/* TABLE AMOUNT & TOTAL */}
            <CashApprovalTable total={total} />
          </Col>

          <Col md={3} className="ps-md-2">
            <Reference data={data} />
          </Col>
        </Row>
      </Container>

      <PickRevolvingFund
        show={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSelect={(fundId) => handleUpdateRequest("completed", "", fundId)}
      />

      {/* PRINTABLE */}
      <div className="d-none">
        <PrintableCashRequest
          data={{ ...data, items: [] }}
          amountInWords={amountInWords}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
};

export default FinanceApprovalForm;
