import { useMemo, useRef, useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import {
  approvalFormFields,
  approvalPartnerFields,
} from "../../../../handlers/columnHeaders";
import { numberToWords } from "../../../../utils/numberToWords";
import PrintableCashRequest from "../../../print/PrintableCashRequest";
import PrintableCashVoucher from "../../../print/PrintableCashVoucher";
import CashApprovalTable from "../../team-leader/cash-request/CashApprovalTable";
import ActionButtons from "../../../ui/buttons/ActionButtons";
import PickRevolvingFund from "../../../ui/modal/admin/PickRevolvingFund";
import { showSwal, confirmSwal } from "../../../../utils/swal";

const FinanceApprovalForm = () => {
  const contentRef = useRef(null);
  const contentVoucherRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const employeeName =
    localStorage.getItem("employee_fullname") ||
    localStorage.getItem("username") ||
    "";

  const [cashVoucher, setCashVoucher] = useState(data?.cash_voucher || null);
  const [amountInWords, setAmountInWords] = useState("");
  const [showFundModal, setShowFundModal] = useState(false);

  const total = useMemo(() => parseFloat(data?.amount || 0), [data]);

  useEffect(() => {
    if (!isNaN(total)) setAmountInWords(numberToWords(total));
  }, [total]);

  const reactToPrintFn = useReactToPrint({ contentRef });
  const reactToPrintVoucherFn = useReactToPrint({
    contentRef: contentVoucherRef,
  });

  const handleUpdateRequest = async (
    status,
    remarks = "",
    revolvingFundId = null
  ) => {
    try {
      let generatedVoucher = null;
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

        generatedVoucher = (Number(voucherInfo?.cash_voucher) || 0) + 1;
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
            cash_voucher: generatedVoucher,
          }),
        });
      }

      const payload = {
        status,
        id: data?.id,
        remarks,
        updated_by: employeeName,
        department_name: data?.department_name || "N/A",
        cash_voucher: generatedVoucher,
      };

      const res = await fetch("/api5012/cash_request/updatecash_request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update cash request");
      const updatedData = await res.json();

      if (status === "completed" && generatedVoucher) {
        setCashVoucher(generatedVoucher);
      }

      showSwal({
        icon: "success",
        title:
          status === "completed"
            ? "Cash request approved & disbursed"
            : "Cash request rejected",
      });

      if (status === "completed" && cashVoucher) {
        setCashVoucher(cashVoucher);

        setTimeout(() => {
          reactToPrintVoucherFn();
          navigate(-1);
        }, 500);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error("Error in handleUpdateRequest:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Something went wrong while processing approval.",
      });
    }
  };

  const handleSelectFund = (fundId) => {
    confirmSwal({
      title: "Are you sure?",
      text: "Do you want to approve this cash request using the selected fund?",
      icon: "question",
      confirmButtonText: "Yes, approve",
      confirmButtonColor: "#008000",
      cancelButtonColor: "#000000",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateRequest("completed", "", fundId);
        setShowFundModal(false);
      }
    });
  };

  const handleReject = () => {
    confirmSwal({
      title: "Reject Cash Request",
      input: "text",
      inputLabel: "Enter remarks for rejection:",
      inputPlaceholder: "Type remarks here...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleUpdateRequest("rejected", result.value);
      }
    });
  };

  return (
    <div className="pb-3">
      <Container fluid>
        <ActionButtons
          onApprove={() => setShowFundModal(true)}
          onReject={handleReject}
          onPrint={reactToPrintFn}
          onPrintVoucher={reactToPrintVoucherFn}
          onBack={() => navigate(-1)}
          status={data?.status}
          role="finance"
          printRequestLabel="Print Request Form"
          printVoucherLabel="Print Voucher Form"
        />

        <Row>
          <Col md={12} className="d-flex flex-column">
            <div className="custom-container border p-3">
              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Description:</strong>
                  <p className="ms-md-2 mb-0 text-start">
                    {data?.description || "N/A"}
                  </p>
                </Col>
              </Row>

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

              <Row className="mb-2">
                <Col xs={12} className="d-flex flex-column flex-md-row">
                  <strong className="title text-start">Amount in Words:</strong>
                  <p className="ms-md-2 mb-0 text-start">{amountInWords}</p>
                </Col>
              </Row>
            </div>

            <CashApprovalTable total={total} />
          </Col>
        </Row>
      </Container>

      <PickRevolvingFund
        show={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSelect={handleSelectFund}
      />

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

      <div className="d-none">
        <PrintableCashVoucher
          data={{
            ...data,
            description: data?.description,
            total: total,
            items: data?.items || [],
            cash_voucher: cashVoucher,
          }}
          amountInWords={amountInWords}
          contentRef={contentVoucherRef}
        />
      </div>
    </div>
  );
};

export default FinanceApprovalForm;
