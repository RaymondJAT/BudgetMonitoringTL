import { FaArrowLeft, FaPlus, FaPrint, FaEdit } from "react-icons/fa";
import AppButton from "./AppButton";

const CashReqActionButtons = ({
  onBack,
  onPrint,
  onView,
  onShowLiqFormModal,
  onEdit,
  showLiquidationButton = false,
  liquidationDisabled = false,
  showEditButton = false,
}) => {
  return (
    <div className="custom-btn d-flex flex-wrap justify-content-between align-items-center pt-3 pb-3">
      {/* LEFT BUTTONS */}
      <div className="d-flex">
        {/* Back Button */}
        <AppButton
          label={<FaArrowLeft />}
          variant="outline-dark"
          size="sm"
          onClick={onBack}
          className="custom-app-button btn-responsive"
        />

        {/* Liquidation Button */}
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
            disabled={liquidationDisabled}
          />
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

      {/* RIGHT BUTTONS */}
      <div className="ms-auto d-flex">
        {showEditButton && (
          <AppButton
            label={
              <>
                <FaEdit /> <span className="d-sm-inline ms-1">Edit</span>
              </>
            }
            variant="outline-dark"
            size="sm"
            onClick={onEdit}
            className="custom-app-button btn-responsive"
          />
        )}
      </div>
    </div>
  );
};

export default CashReqActionButtons;
