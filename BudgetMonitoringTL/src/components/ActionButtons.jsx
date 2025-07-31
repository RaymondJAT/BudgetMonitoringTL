import {
  FaArrowLeft,
  FaTrash,
  FaBookmark,
  FaPrint,
  FaCheck,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
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
    <div className="custom-btn d-flex flex-wrap justify-content-between align-items-center pt-3 pb-3">
      <div className="d-flex">
        <AppButton
          label={
            <>
              <FaArrowLeft />
            </>
          }
          variant="outline-dark"
          size="sm"
          onClick={onBack}
          className="custom-app-button btn-responsive"
        />

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
              <ImCross /> <span className="d-sm-inline ms-1">Reject</span>
            </>
          }
          variant="outline-danger"
          size="sm"
          onClick={onReject}
          className="custom-app-button btn-responsive ms-2"
        />
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
      <div className="d-flex ms-md-auto mt-md-0">
        <AppButton
          label={
            <>
              <FaBookmark /> <span className="d-sm-inline ms-1">Important</span>
            </>
          }
          variant="outline-dark"
          size="sm"
          onClick={onImportant}
          className="custom-app-button btn-responsive ms-2"
        />

        <AppButton
          label={
            <>
              <FaTrash /> <span className="d-sm-inline ms-1">Delete</span>
            </>
          }
          variant="outline-danger"
          size="sm"
          onClick={onDelete}
          className="custom-app-button btn-responsive ms-2"
        />
      </div>
    </div>
  );
};

export default ActionButtons;
