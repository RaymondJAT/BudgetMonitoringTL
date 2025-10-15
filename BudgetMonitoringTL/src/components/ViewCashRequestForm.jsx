import { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
import CashReqActionButtons from "./ui/buttons/CashReqActionButtons";
import LiqFormModal from "./ui/modal/employee/LiqFormModal";
import EditCashRequest from "./ui/modal/employee/EditCashRequest";

const ViewCashRequestForm = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const [amountInWords, setAmountInWords] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hasLiquidation, setHasLiquidation] = useState(false);

  const rejectedRemark = useMemo(() => {
    if (!data?.activities) return null;
    const rejected = data.activities.find(
      (activity) => activity.action === "REJECTED"
    );
    return rejected ? rejected.remarks : null;
  }, [data?.activities]);

  const total = useMemo(() => parseFloat(data?.amount || 0), [data]);

  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    if (!isNaN(total)) setAmountInWords(numberToWords(total));
  }, [total]);

  // CHECK FUNCTION
  const checkExistingLiquidation = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api5012/cash_request/getexisting_cash_request?id=${data?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch liquidation data");

      const result = await res.json();
      setHasLiquidation(!(Array.isArray(result) && result.length > 0));
    } catch (err) {
      console.error("Error checking liquidation:", err);
      setHasLiquidation(false);
    }
  }, [data?.id]);

  useEffect(() => {
    if (data?.id) {
      checkExistingLiquidation();
    }
  }, [data?.id, checkExistingLiquidation]);

  return (
    <div className="pb-3">
      <Container fluid>
        {/* ACTION BUTTONS */}
        <CashReqActionButtons
          onBack={() => navigate(-1)}
          onView={() => setShowModal(true)}
          onPrint={reactToPrintFn}
          onShowLiqFormModal={() => setShowLiqFormModal(true)}
          showLiquidationButton={data?.status === "completed"}
          liquidationDisabled={hasLiquidation}
          onEdit={() => setShowEditModal(true)}
          showEditButton={
            data?.status === "pending" || data?.status === "rejected"
          }
        />

        {/* LIQUIDATION MODAL */}
        <LiqFormModal
          show={showLiqFormModal}
          onHide={() => setShowLiqFormModal(false)}
          requestData={{
            reference_id: data?.reference_id || "",
            description: data?.description || "",
            employee: data?.employee || "",
            department: data?.department || "",
            amount_issue: data?.amount || 0,
            request_items: [],
          }}
          onSuccess={() => {
            const refreshLiquidation = async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                  `/api5012/cash_request/getexisting_cash_request?id=${data?.id}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!res.ok)
                  throw new Error("Failed to fetch liquidation data");
                const result = await res.json();

                setHasLiquidation(
                  !(Array.isArray(result) && result.length > 0)
                );
              } catch (err) {
                console.error("Error refreshing liquidation:", err);
              }
            };

            refreshLiquidation();
          }}
        />

        {/* REMARKS */}
        {data?.status?.toLowerCase() === "rejected" && !!rejectedRemark && (
          <Row className="mb-3">
            <Col xs={12}>
              <div
                className="p-2 border rounded"
                style={{ borderColor: "#e87272ff", background: "#fff5f5" }}
              >
                <strong
                  className="text-danger me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  Remarks:
                </strong>
                <span className="fw-bold" style={{ fontSize: "0.8rem" }}>
                  {rejectedRemark}
                </span>
              </div>
            </Col>
          </Row>
        )}

        {/* REQUEST INFORMATION */}
        <div className="custom-container border p-3">
          <Row className="mb-2">
            <Col xs={12} className="d-flex flex-column flex-md-row">
              <strong className="title text-start">Particulars:</strong>
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
                  {key === "total"
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

        {/* TABLE: AMOUNT + TOTAL */}
        <CashApprovalTable total={total} />
      </Container>

      {/* HIDDEN PRINTABLE COMPONENT */}
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

      {/* MODAL PREVIEW */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Body>
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
        </Modal.Body>
      </Modal>

      {/* EDIT MODAL */}
      <EditCashRequest
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        requestData={data}
      />
    </div>
  );
};

export default ViewCashRequestForm;
