import { FaArrowLeft, FaPrint, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AppButton from "./ui/AppButton";

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
      status?.toLowerCase() === "completed";
  } else if (role === "finance") {
    isApproved = status?.toLowerCase() === "completed";
  }

  // Determine if the request is already approved
  // const isApproved =
  //   status?.toLowerCase() === "approved" ||
  //   status?.toLowerCase() === "completed";

  return (
    <div className="custom-btn d-flex flex-wrap justify-content-start align-items-center pt-3 pb-3">
      {/* Back Button */}
      <AppButton
        label={<FaArrowLeft />}
        variant="outline-dark"
        size="sm"
        onClick={onBack}
        className="custom-app-button btn-responsive"
      />

      {/* Approve/Reject only if not hidden */}
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
            onClick={onApprove}
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
            onClick={onReject}
            className="custom-app-button btn-responsive ms-2"
          />
        </>
      )}

      {/* Print Button */}
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
