import { FaArrowLeft, FaTrash, FaBookmark } from "react-icons/fa";
import AppButton from "./ui/AppButton";

const CashReqActionButtons = ({
  onBack,
  onPrint,
  onView,
  onShowLiqFormModal,
}) => {
  return (
    <div className="custom-btn d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-3">
      <div className="d-flex">
        {/* Back Button */}
        <AppButton
          variant="outline-dark"
          size="sm"
          onClick={onBack}
          className="custom-app-button btn-responsive"
        >
          <FaArrowLeft />
        </AppButton>

        {/* Create Liquidation Form Button */}
        <AppButton
          label="Create Liquidation Form"
          variant="success"
          size="sm"
          onClick={onShowLiqFormModal}
          className="custom-app-button btn-responsive ms-2"
        />

        {/* View Button */}
        <AppButton
          label="View"
          variant="outline-dark"
          size="sm"
          onClick={onView}
          className="custom-app-button btn-responsive ms-2"
        />

        {/* Print Button */}
        <AppButton
          label="Print"
          variant="outline-secondary"
          size="sm"
          onClick={onPrint}
          className="custom-app-button btn-responsive ms-2"
        />
      </div>

      {/* Bookmark + Trash */}
      <div className="d-flex gap-2 ms-md-auto mt-2 mt-md-0">
        <AppButton
          variant="outline-warning"
          size="sm"
          className="custom-app-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaBookmark size="0.75rem" />
        </AppButton>
        <AppButton
          variant="outline-dark"
          size="sm"
          className="custom-app-button btn-responsive d-flex align-items-center justify-content-center"
        >
          <FaTrash size="0.75rem" />
        </AppButton>
      </div>
    </div>
  );
};

export default CashReqActionButtons;
