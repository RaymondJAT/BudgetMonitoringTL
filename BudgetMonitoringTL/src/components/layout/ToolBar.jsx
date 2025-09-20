import { useState, useEffect, useRef } from "react";
import { FaFilter, FaFileExport } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SearchBar from "../SearchBar";
import AppButton from "../ui/buttons/AppButton";

const ToolBar = ({
  searchValue,
  onSearchChange,
  leftContent,
  handleExport,
  selectedCount,
  onDateRangeChange,
  showFilter = true,
  searchBarWidth = "100%",
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const datePickerRef = useRef(null);

  const handleClose = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showDatePicker]);

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          gap: "10px",
          marginBottom: "1rem",
          fontSize: "0.8rem",
          position: "relative",
        }}
      >
        {/* Left Side */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {leftContent}
          {selectedCount > 0 && (
            <AppButton
              label={
                <>
                  <FaFileExport />
                  <span className="d-none d-sm-inline ms-1">Export</span>
                </>
              }
              variant="outline-dark"
              size="sm"
              onClick={handleExport}
              className="custom-app-button"
            />
          )}
        </div>

        {/* Right Side */}
        <div
          className="d-flex align-items-center ms-auto"
          style={{ gap: "10px", flexWrap: "wrap" }}
        >
          {/* Search and Filter grouped together */}
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            {showFilter && (
              <AppButton
                label={
                  <span className="d-flex align-items-center">
                    <FaFilter className="me-1" />
                    <span>Filter</span>
                  </span>
                }
                variant="outline-dark"
                size="sm"
                onClick={() => setShowDatePicker(true)}
                className="custom-app-button"
              />
            )}

            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              className="custom-search-bar responsive-searchbar"
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "0.8rem",
              }}
            />
          </div>
        </div>
      </div>
      {showDatePicker && (
        <div
          className="datepicker-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            ref={datePickerRef}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable
              inline
              calendarClassName="w-100"
              dateFormat="yyyy-MM-dd"
            />
            <div className="d-flex justify-content-end mt-2">
              <AppButton
                label="Close"
                size="sm"
                variant="outline-danger"
                onClick={handleClose}
                className="custom-app-button me-2"
              />
              <AppButton
                label="Apply"
                size="sm"
                variant="outline-success"
                onClick={() => {
                  if (startDate && endDate) {
                    onDateRangeChange(startDate, endDate);
                  }
                  setShowDatePicker(false);
                }}
                className="custom-app-button"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolBar;
