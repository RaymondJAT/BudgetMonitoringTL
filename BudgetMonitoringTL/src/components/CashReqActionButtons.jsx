import { FaArrowLeft, FaTrash, FaBookmark } from "react-icons/fa";
import AppButton from "./ui/AppButton";

const CashReqActionButtons = ({ onBack, onPrint, onView }) => {
  return (
    <div className="custom-btn d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-3">
      <div className="d-flex">
        <AppButton
          variant="dark"
          size="sm"
          onClick={onBack}
          className="custom-button btn-responsive"
        >
          <FaArrowLeft />
        </AppButton>
        <AppButton
          label="View"
          variant="dark"
          size="sm"
          onClick={onView}
          className="custom-button btn-responsive ms-2"
        />
        <AppButton
          label="Print"
          variant="secondary"
          size="sm"
          onClick={onPrint}
          className="custom-button btn-responsive ms-2"
        />
      </div>
      <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
        <AppButton
          variant="warning"
          size="sm"
          className="custom-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaBookmark size="0.75rem" />
        </AppButton>
        <AppButton
          variant="dark"
          size="sm"
          className="custom-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaTrash size="0.75rem" />
        </AppButton>
      </div>
    </div>
  );
};

export default CashReqActionButtons;
