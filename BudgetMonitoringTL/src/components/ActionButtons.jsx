import { FaArrowLeft, FaTrash, FaStar } from "react-icons/fa";
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
          variant="dark"
          size="sm"
          onClick={onBack}
          className="custom-button btn-responsive"
        >
          <FaArrowLeft />
        </AppButton>
        <AppButton
          label="Approve"
          variant="success"
          size="sm"
          onClick={onApprove}
          className="custom-button btn-responsive"
        />
        <AppButton
          label="Reject"
          variant="danger"
          size="sm"
          onClick={onReject}
          className="custom-button btn-responsive"
        />
        <AppButton
          label="Print"
          variant="secondary"
          size="sm"
          onClick={onPrint}
          className="custom-button btn-responsive"
        />
      </div>
      <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
        <AppButton
          variant="warning"
          size="sm"
          onClick={onImportant}
          className="custom-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaStar size="0.75rem" />
        </AppButton>
        <AppButton
          variant="dark"
          size="sm"
          onClick={onDelete}
          className="custom-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaTrash size="0.75rem" />
        </AppButton>
      </div>
    </div>
  );
};

export default ActionButtons;
