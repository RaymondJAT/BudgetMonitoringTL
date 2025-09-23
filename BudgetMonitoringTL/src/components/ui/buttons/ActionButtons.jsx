import { FaArrowLeft, FaPrint, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AppButton from "./AppButton";
import Swal from "sweetalert2";

const ActionButtons = ({
  onApprove,
  onReject,
  onPrint,
  onPrintVoucher,
  onBack,
  status,
  role,
  hideApproveReject = false,
  printRequestLabel = "",
  printVoucherLabel = "",
}) => {
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
    const isApprove = type === "approve";
    const needConfirm =
      role === "teamlead" ||
      (role === "finance" && !isApprove) ||
      role === "admin";

    if (!needConfirm && isApprove) {
      callback?.();
      return;
    }

    const confirmResult = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${type} this request?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Yes, approve it" : "Yes, reject it",
      confirmButtonColor: isApprove ? "#008000" : "#ff0000",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#000000",
    });

    if (confirmResult.isConfirmed) {
      callback?.();
      await Swal.fire({
        title: isApprove ? "Approved!" : "Rejected!",
        text: `The request has been ${
          isApprove ? "approved" : "rejected"
        } successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="custom-btn d-flex flex-wrap justify-content-start align-items-center pt-3 pb-3">
      {/* BACK BUTTON */}
      <AppButton
        label={<FaArrowLeft />}
        variant="outline-dark"
        size="sm"
        onClick={onBack}
        className="custom-app-button btn-responsive"
      />

      {/* APPROVE/REJECT IF NOT HIDDEN */}
      {!hideApproveReject && !isApproved && (
        <>
          <AppButton
            label={
              <>
                <FaCheck />
                <span className="d-sm-inline ms-1">Approve</span>
              </>
            }
            variant="outline-success"
            size="sm"
            onClick={() => handleAction("approve", onApprove)}
            className="custom-app-button btn-responsive ms-2"
          />

          <AppButton
            label={
              <>
                <ImCross />
                <span className="d-sm-inline ms-1">Reject</span>
              </>
            }
            variant="outline-danger"
            size="sm"
            onClick={() => handleAction("reject", onReject)}
            className="custom-app-button btn-responsive ms-2"
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
        />
      )}
    </div>
  );
};

export default ActionButtons;
