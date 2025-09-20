import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

import {
  liquidationLeftFields,
  liquidationRightFields,
} from "../../../../handlers/columnHeaders";
import ActionButtons from "../../../ui/buttons/ActionButtons";
import LiquidApprovalTable from "../../team-leader/liquidation/LiquidApprovalTable";
import PrintableLiquidForm from "../../../print/PrintableLiquidForm";
import LiquidationReceipt from "../../team-leader/liquidation/LiquidationReceipt";
import { normalizeBase64Image } from "../../../../utils/image";
import PickRevolvingFund from "../../../ui/modal/admin/PickRevolvingFund";
import Reference from "../../../Reference";

const FinanceLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [showFundModal, setShowFundModal] = useState(false);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // RECEIPTS
  const receiptImages = useMemo(() => {
    const requesterReceipts = [
      ...(Array.isArray(data?.receipts)
        ? data.receipts
        : data?.receipts
        ? [data.receipts]
        : []),
      ...(Array.isArray(data?.liquidation_activities)
        ? data.liquidation_activities.flatMap((act) => {
            if (!act.receipts) return [];
            try {
              const parsed = JSON.parse(act.receipts);
              return Array.isArray(parsed)
                ? parsed.map((r) => normalizeBase64Image(r.image || r))
                : [normalizeBase64Image(act.receipts)];
            } catch {
              return [normalizeBase64Image(act.receipts)];
            }
          })
        : []),
    ].map(normalizeBase64Image);

    return Array.from(new Set(requesterReceipts));
  }, [data]);

  // TRANSACTION AND TOTAL
  useEffect(() => {
    const items = data?.liquidation_items || [];
    setTransactions(items);
    setTotal(items.reduce((sum, item) => sum + (item.amount ?? 0), 0));
  }, [data]);

  // APPROVE
  const handleApprove = async (fundId) => {
    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Unknown";

      const liquidationPayload = {
        id: data?.id,
        status: "verified",
        remarks: "",
        created_by: employeeName,
      };

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(liquidationPayload),
      });

      if (!res.ok) throw new Error("Failed to approve liquidation");
      const updated = await res.json();
      const responseData = Array.isArray(updated) ? updated[0] : updated;

      const disbursementPayload = {
        rf_id: fundId,
        amount_expended: parseFloat(responseData.amount_expended) || 0,
        amount_return: parseFloat(responseData.amount_return) || 0,
        amount_reimburse: parseFloat(responseData.amount_reimburse) || 0,
        cash_voucher: responseData.cash_voucher || data?.cv_number,
      };

      const resDisb = await fetch(
        `/api5001/cash_disbursement/updatecash_disbursement_cv`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(disbursementPayload),
        }
      );

      if (!resDisb.ok) throw new Error("Failed to update cash disbursement");

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Liquidation approved successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      console.error("Approve error:", err);
      Swal.fire("Error", "Something went wrong while approving.", "error");
    }
  };

  // SELECT FUND CONFIRM
  const handleSelectFund = (fundId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this liquidation using the selected fund?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      confirmButtonColor: "#008000",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#000000",
      zIndex: 2000,
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove(fundId);
        setShowFundModal(false);
      }
    });
  };

  // REJECT WITH REMARKS
  const handleReject = async () => {
    const remarks = prompt("Enter remarks for rejection:") || "";

    try {
      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name") || "Unknown";

      const payload = {
        id: data?.id,
        status: "rejected",
        remarks,
        created_by: employeeName,
      };

      const res = await fetch(`/api5012/liquidation/update_liquidation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let responseData;
      try {
        responseData = await res.json(); // parse JSON if available
      } catch {
        responseData = null; // empty body (204)
      }

      if (!res.ok) {
        console.warn(
          "API returned non-ok status but update may have succeeded:",
          responseData
        );
      }

      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Liquidation rejected successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      console.error("Reject error:", err);
      Swal.fire("Error", "Something went wrong while rejecting.", "error");
    }
  };

  const renderInfoFields = () => (
    <Row>
      <Col md={6}>
        {liquidationLeftFields.map(({ label, key }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">{data?.[key] ?? "N/A"}</p>
            </Col>
          </Row>
        ))}
      </Col>
      <Col md={6}>
        {liquidationRightFields.map(({ label, key }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={12} className="d-flex align-items-center">
              <strong className="title">{label}:</strong>
              <p className="ms-2 mb-0">
                {data?.[key] != null && !isNaN(Number(data[key]))
                  ? `₱${Number(data[key]).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}`
                  : data?.[key] ?? "N/A"}
              </p>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  const remarks =
    data?.remarks ||
    (Array.isArray(data?.liquidation_activities) &&
      data.liquidation_activities[0]?.remarks) ||
    "";

  return (
    <>
      <Container fluid className="pb-3">
        <ActionButtons
          onApprove={() => setShowFundModal(true)}
          onReject={handleReject}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          approveLabel="Approve"
          status={data?.status}
          role="finance"
        />

        <Row className="g-3">
          <Col md={9}>
            <div className="custom-container border p-3">
              {renderInfoFields()}
            </div>

            <LiquidApprovalTable transactions={transactions} total={total} />
            <LiquidationReceipt images={receiptImages} remarks={remarks} />
          </Col>
          <Col md={3}>
            <div
              style={{
                height: "80vh",
                overflowY: "auto",
                position: "sticky",
                top: 0,
              }}
            >
              <Reference items={data?.liquidation_items || []} />
            </div>
          </Col>
        </Row>
      </Container>

      <div className="d-none">
        <PrintableLiquidForm data={{ ...data }} contentRef={contentRef} />
      </div>

      <PickRevolvingFund
        show={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSelect={handleSelectFund}
      />
    </>
  );
};

export default FinanceLiquidForm;
