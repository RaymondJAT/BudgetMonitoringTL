import { FaArrowLeft, FaTrash, FaBookmark } from "react-icons/fa";
import AppButton from "./ui/AppButton";

const ActionButtons = ({
  onApprove,
  onReject,
  onPrint,
  onBack,
  onImportant,
  onDelete,
}) => {
  return (
    <div className="custom-btn d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-3">
      <div className="d-flex gap-1">
        <AppButton
          variant="outline-dark"
          size="sm"
          onClick={onBack}
          className="custom-app-button btn-responsive"
        >
          <FaArrowLeft />
        </AppButton>
        <AppButton
          label="Approve"
          variant="outline-success"
          size="sm"
          onClick={onApprove}
          className="custom-app-button btn-responsive"
        />
        <AppButton
          label="Reject"
          variant="outline-danger"
          size="sm"
          onClick={onReject}
          className="custom-app-button btn-responsive"
        />
        <AppButton
          label="Print"
          variant="outline-secondary"
          size="sm"
          onClick={onPrint}
          className="custom-app-button btn-responsive"
        />
      </div>
      <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
        <AppButton
          variant="outline-warning"
          size="sm"
          onClick={onImportant}
          className="custom-app-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaBookmark size="1rem" />
        </AppButton>
        <AppButton
          variant="outline-dark"
          size="sm"
          onClick={onDelete}
          className="custom-app-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaTrash size="1rem" />
        </AppButton>
      </div>
    </div>
  );
};

export default ActionButtons;
