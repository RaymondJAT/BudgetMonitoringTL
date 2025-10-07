import { useState } from "react";
import { FaArrowLeft, FaPrint, FaCheck, FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AppButton from "./AppButton";
import Swal from "sweetalert2";

const ActionButtons = ({
  onApprove,
  onReject,
  onPrint,
  onPrintVoucher,
  onBack,
  onEdit,
  status,
  role,
  hideApproveReject = false,
  printRequestLabel = "",
  printVoucherLabel = "",
  formType = "request",
}) => {
  const [loadingAction, setLoadingAction] = useState(null);

  let isApproved = false;

  if (role === "teamlead") {
    isApproved =
      status?.toLowerCase() === "approved" ||
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified" ||
      status?.toLowerCase() === "rejected";
  } else if (role === "finance") {
    isApproved =
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified" ||
      status?.toLowerCase() === "rejected";
  } else if (role === "admin") {
    isApproved =
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "rejected";
  }

  const handleAction = async (type, callback) => {
    if (loadingAction) return;

    const isApprove = type === "approve";
    const needConfirm =
      role === "teamlead" ||
      (role === "finance" && !isApprove) ||
      role === "admin";

    if (!needConfirm && isApprove) {
      setLoadingAction(type);
      await callback?.();
      setLoadingAction(null);
      return;
    }

    if (isApprove) {
      if (role === "teamlead" && formType === "liquidation") {
        const { value: remarks } = await Swal.fire({
          title: "Approve Liquidation",
          input: "textarea",
          inputLabel: "Remarks (optional)",
          inputPlaceholder: "Add remarks if necessary...",
          inputAttributes: {
            "aria-label": "Type your remarks here",
          },
          showCancelButton: true,
          confirmButtonText: "Approve",
          confirmButtonColor: "#008000",
          cancelButtonText: "Cancel",
          cancelButtonColor: "#000000",
        });

        if (remarks !== undefined) {
          try {
            setLoadingAction(type);
            await callback?.(remarks);
            await Swal.fire({
              title: "Approved!",
              text: "The liquidation has been approved successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } finally {
            setLoadingAction(null);
          }
        }
      } else {
        const confirmResult = await Swal.fire({
          title: `Are you sure?`,
          text: `Do you want to approve this request?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, approve it",
          confirmButtonColor: "#008000",
          cancelButtonText: "Cancel",
          cancelButtonColor: "#000000",
        });

        if (confirmResult.isConfirmed) {
          try {
            setLoadingAction(type);
            await callback?.();
            await Swal.fire({
              title: "Approved!",
              text: "The request has been approved successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } finally {
            setLoadingAction(null);
          }
        }
      }
    } else {
      const { value: remarks } = await Swal.fire({
        title: "Reject Cash Request",
        input: "textarea",
        inputLabel: "Enter remarks",
        inputPlaceholder: "Type your reason here...",
        inputAttributes: {
          "aria-label": "Type your reason here",
        },
        showCancelButton: true,
        confirmButtonText: "Reject",
        confirmButtonColor: "#ff0000",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#000000",
        inputValidator: (value) => {
          if (!value) return "Remarks are required!";
          return null;
        },
      });

      if (remarks) {
        try {
          setLoadingAction(type);
          await callback?.(remarks);
          await Swal.fire({
            title: "Rejected!",
            text: "The request has been rejected successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } finally {
          setLoadingAction(null);
        }
      }
    }
  };

  return (
    <div className="custom-btn d-flex flex-wrap justify-content-start align-items-center pt-3 pb-3 w-100">
      {/* BACK BUTTON */}
      <AppButton
        label={<FaArrowLeft />}
        variant="outline-dark"
        size="sm"
        onClick={onBack}
        className="custom-app-button btn-responsive"
        disabled={!!loadingAction}
      />

      {/* APPROVE/REJECT IF NOT HIDDEN */}
      {!hideApproveReject && !isApproved && (
        <>
          <AppButton
            label={
              <>
                {loadingAction === "approve" ? (
                  <span className="spinner-border spinner-border-sm me-1" />
                ) : (
                  <FaCheck />
                )}
                <span className="d-sm-inline ms-1">Approve</span>
              </>
            }
            variant="outline-success"
            size="sm"
            onClick={() => handleAction("approve", onApprove)}
            className="custom-app-button btn-responsive ms-2"
            disabled={loadingAction === "approve" || !!loadingAction}
          />

          <AppButton
            label={
              <>
                {loadingAction === "reject" ? (
                  <span className="spinner-border spinner-border-sm me-1" />
                ) : (
                  <ImCross />
                )}
                <span className="d-sm-inline ms-1">Reject</span>
              </>
            }
            variant="outline-danger"
            size="sm"
            onClick={() => handleAction("reject", onReject)}
            className="custom-app-button btn-responsive ms-2"
            disabled={loadingAction === "reject" || !!loadingAction}
          />
        </>
      )}

      {/* PRINT BUTTON */}
      <AppButton
        label={
          <>
            <FaPrint />{" "}
            <span className="d-sm-inline ms-1">{printRequestLabel}</span>
          </>
        }
        variant="outline-secondary"
        size="sm"
        onClick={onPrint}
        className="custom-app-button btn-responsive ms-2"
        disabled={!!loadingAction}
      />

      {role === "finance" && status?.toLowerCase() === "completed" && (
        <AppButton
          label={
            <>
              <FaPrint />{" "}
              <span className="d-sm-inline ms-1">{printVoucherLabel}</span>
            </>
          }
          variant="outline-secondary"
          size="sm"
          onClick={onPrintVoucher}
          className="custom-app-button btn-responsive ms-2"
          disabled={!!loadingAction}
        />
      )}

      {/* EDIT BUTTON FOR REJECTED REQUESTS */}
      {status?.toLowerCase() === "rejected" && onEdit && (
        <div className="ms-auto">
          <AppButton
            label={
              <>
                <FaEdit /> <span className="d-sm-inline ms-1">Edit</span>
              </>
            }
            variant="outline-dark"
            size="sm"
            onClick={onEdit}
            className="custom-app-button btn-responsive ms-2"
            disabled={!!loadingAction}
          />
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
