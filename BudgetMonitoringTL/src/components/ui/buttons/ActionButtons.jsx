import { FaArrowLeft, FaPrint, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AppButton from "./AppButton";
import Swal from "sweetalert2";

const ActionButtons = ({
  onApprove,
  onReject,
  onPrint,
  onBack,
  status,
  role,
  hideApproveReject = false,
}) => {
  let isApproved = false;

  if (role === "teamlead") {
    isApproved =
      status?.toLowerCase() === "approved" ||
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified";
  } else if (role === "finance") {
    isApproved =
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified";
  }

  const handleApprove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) onApprove();
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it",
      confirmButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#000000",
    }).then((result) => {
      if (result.isConfirmed) onReject();
    });
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
            onClick={() => {
              if (role === "finance") {
                onApprove();
              } else {
                Swal.fire({
                  title: "Are you sure?",
                  text: "Do you want to approve this request?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Yes, approve it",
                  confirmButtonColor: "#008000",
                  cancelButtonText: "Cancel",
                  cancelButtonColor: "#000000",
                }).then((result) => {
                  if (result.isConfirmed) onApprove();
                });
              }
            }}
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
            onClick={handleReject}
            className="custom-app-button btn-responsive ms-2"
          />
        </>
      )}

      {/* PRINT BUTTON */}
      <AppButton
        label={
          <>
            <FaPrint /> <span className="d-sm-inline ms-1">Print</span>
          </>
        }
        variant="outline-secondary"
        size="sm"
        onClick={onPrint}
        className="custom-app-button btn-responsive ms-2"
      />
    </div>
  );
};

export default ActionButtons;
