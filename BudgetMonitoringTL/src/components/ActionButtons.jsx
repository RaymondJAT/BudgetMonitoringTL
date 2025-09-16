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
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified";
  } else if (role === "finance") {
    isApproved =
      status?.toLowerCase() === "completed" ||
      status?.toLowerCase() === "verified";
  }

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

      {/* APPROVE/REJECT IF NOT HIDDENT */}
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
