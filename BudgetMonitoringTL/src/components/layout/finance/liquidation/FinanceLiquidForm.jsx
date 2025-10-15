import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

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
import { showSwal, confirmSwal } from "../../../../utils/swal";

const FinanceLiquidForm = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [showFundModal, setShowFundModal] = useState(false);
  const [activities, setActivities] = useState([]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // LIQUIDATION ACTIVITIES
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !data?.id) return;

        console.log("Fetching activities for liquidation ID:", data.id);

        const res = await fetch(
          `/api5012/liquidation_activity/getliquidation_activity_by_id?id=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch activities:", text);
          throw new Error("Failed to fetch liquidation activities");
        }

        const result = await res.json();
        console.log("Fetched activities:", result);
        setActivities(result || []);
      } catch (err) {
        console.error("Error fetching liquidation activities:", err);
      }
    };

    fetchActivities();
  }, [data?.id]);

  // LIQUIDATION ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !data?.id) return;

        console.log("Attempting fetch for liquidation ID:", data.id);

        const res = await fetch(
          `/api5012/liquidation_item/getliquidation_item_by_id?id=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const text = await res.text();
        console.log("Raw response text:", text);

        const result = JSON.parse(text);
        console.log("Parsed liquidation items:", result);

        setTransactions(result || []);
        setTotal(
          (result || []).reduce(
            (sum, item) => sum + parseFloat(item.amount || 0),
            0
          )
        );
      } catch (err) {
        console.error("Error fetching liquidation items:", err);
      }
    };

    fetchItems();
  }, [data?.id]);

  // RECEIPTS & REMARKS
  const receiptImages = useMemo(() => {
    const requesterReceipts = [
      ...(Array.isArray(data?.receipts)
        ? data.receipts
        : data?.receipts
        ? [data.receipts]
        : []),
      ...(Array.isArray(activities)
        ? activities.flatMap((act) => {
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
  }, [data, activities]);

  //  APPROVE
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

      showSwal({
        icon: "success",
        title: "Approved!",
        text: "Liquidation approved successfully",
      });

      navigate(-1);
    } catch (err) {
      console.error("Approve error:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Something went wrong while approving.",
      });
    }
  };

  // REJECT
  const handleReject = async (remarks) => {
    if (!remarks) return;

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

      if (!res.ok) throw new Error("Failed to reject liquidation");

      showSwal({
        icon: "success",
        title: "Rejected",
        text: "Liquidation rejected successfully",
      });

      navigate(-1);
    } catch (err) {
      console.error("Reject error:", err);
      showSwal({
        icon: "error",
        title: "Error",
        text: "Something went wrong while rejecting.",
      });
    }
  };

  const renderInfoFields = () => (
    <Row>
      {[0, 1, 2].map((idx) => {
        const leftField = liquidationLeftFields[idx];
        const rightField = liquidationRightFields[idx];
        const isAmountObtained = rightField?.key === "amount_obtained";
        const referenceValue = isAmountObtained
          ? data?.cr_reference_id ?? "N/A"
          : null;

        return (
          <Row key={idx} className="mb-2">
            {/* Employee / Department / Date */}
            <Col md={4} className="d-flex align-items-center">
              <strong className="title">{leftField?.label}:</strong>
              <p className="ms-2 mb-0">{data?.[leftField?.key] ?? "N/A"}</p>
            </Col>

            {/* Amount Obtained / Expended / Return */}
            <Col md={4} className="d-flex align-items-center">
              <strong className="title">
                {rightField?.key === "reimburse_return"
                  ? getReimburseReturnLabel()
                  : rightField?.label}
                :
              </strong>
              <p className="ms-2 mb-0">
                {data?.[rightField?.key] != null &&
                !isNaN(Number(data[rightField?.key]))
                  ? `₱${Number(data[rightField?.key]).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}`
                  : data?.[rightField?.key] ?? "N/A"}
              </p>
            </Col>

            {/* Reference ID */}
            <Col md={4} className="d-flex align-items-center">
              {isAmountObtained && (
                <>
                  <strong className="title">Reference ID:</strong>
                  <p className="ms-2 mb-0">{referenceValue}</p>
                </>
              )}
            </Col>
          </Row>
        );
      })}
    </Row>
  );

  const remarks =
    data?.remarks ||
    (Array.isArray(activities) && activities[0]?.remarks) ||
    "";

  const getReimburseReturnLabel = () => {
    const obtained = parseFloat(data?.amount_obtained) || 0;
    const expended = parseFloat(data?.amount_expended) || 0;

    if (expended < obtained) return "Return";
    if (expended > obtained) return "Reimburse";
    return "Reimburse/Return";
  };

  return (
    <>
      <Container fluid className="pb-3">
        <ActionButtons
          onApprove={() => setShowFundModal(true)}
          onReject={(remarks) => handleReject(remarks)}
          onPrint={reactToPrintFn}
          onBack={() => navigate(-1)}
          approveLabel="Approve"
          status={data?.status}
          role="finance"
          printRequestLabel="Print"
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
              <Reference items={transactions} />
            </div>
          </Col>
        </Row>
      </Container>

      <div className="d-none">
        <PrintableLiquidForm
          data={{
            ...data,
            liquidation_items: transactions,
            total_amount: total,
          }}
          contentRef={contentRef}
        />
      </div>

      <PickRevolvingFund
        show={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSelect={(fundId) => {
          confirmSwal({
            title: "Are you sure?",
            text: "Do you want to approve this liquidation using the selected fund?",
            icon: "question",
            confirmButtonText: "Yes, approve",
            confirmButtonColor: "#008000",
            cancelButtonColor: "#000000",
          }).then((result) => {
            if (result.isConfirmed) handleApprove(fundId);
          });
        }}
      />
    </>
  );
};

export default FinanceLiquidForm;
