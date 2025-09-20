import { FaArrowLeft, FaPlus, FaEye, FaPrint } from "react-icons/fa";
import AppButton from "./AppButton";

const CashReqActionButtons = ({
  onBack,
  onPrint,
  onView,
  onShowLiqFormModal,
  showLiquidationButton = false, // 🔹 new prop
}) => {
  return (
    <div className="custom-btn d-flex flex-wrap justify-content-between align-items-center pt-3 pb-3">
      <div className="d-flex">
        {/* Back Button */}
        <AppButton
          label={<FaArrowLeft />}
          variant="outline-dark"
          size="sm"
          onClick={onBack}
          className="custom-app-button btn-responsive"
        />

        {/* Liquidation Button: Only show if flag is true */}
        {showLiquidationButton && (
          <AppButton
            label={
              <>
                <FaPlus />
                <span className="d-sm-inline ms-1">Liquidation</span>
              </>
            }
            size="sm"
            variant="outline-success"
            onClick={() => onShowLiqFormModal(true)}
            className="custom-app-button ms-2"
          />
        )}

        {/* View Button */}
        <AppButton
          label={
            <>
              <FaEye /> <span className="d-sm-inline ms-1">View</span>
            </>
          }
          variant="outline-dark"
          size="sm"
          onClick={onView}
          className="custom-app-button btn-responsive ms-2"
        />

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
    </div>
  );
};

export default CashReqActionButtons;
