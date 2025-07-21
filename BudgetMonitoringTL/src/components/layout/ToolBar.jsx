import { useState, useEffect, useRef } from "react";
import { FaFilter, FaFileExport, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { filterDropdownItems } from "../../handlers/actionMenuItems";

import SearchBar from "../ui/SearchBar";
import AppButton from "../ui/AppButton";

const ToolBar = ({
  searchValue,
  onSearchChange,
  leftContent,
  handleExport,
  selectedCount,
  onDateRangeChange,
  showFilter = true,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [startDate, endDate] = dateRange;
  const isMobile = window.innerWidth <= 576;

  const datePickerRef = useRef(null);

  const handleClose = () => {
    setShowDatePicker(false);
  };

  const handleFilter = (type) => {
    setSelectedFilter(type);

    if (type === "date-range") {
      setTimeout(() => setShowDatePicker(true), 0);
    } else {
      console.log("Filter by:", type);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      onDateRangeChange(dates);
      setShowDatePicker(false);
    }
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
          fontSize: "0.75rem",
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
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {/* <div style={{ position: "relative" }} ref={datePickerRef}> */}
          {showFilter && (
            <AppButton
              isDropdown
              label={
                <>
                  <FaFilter />
                  <span className="d-none d-sm-inline ms-1">Filter</span>
                </>
              }
              variant="outline-dark"
              size="sm"
              dropdownItems={[
                ...filterDropdownItems(handleFilter).map((item) => ({
                  ...item,
                  label: (
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{item.label}</span>
                      <input
                        type="radio"
                        name="filter"
                        checked={selectedFilter === item.value}
                        onChange={() => handleFilter(item.value)}
                        style={{
                          accentColor: "maroon",
                          width: "14px",
                          height: "14px",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  ),
                  onClick: () => handleFilter(item.value),
                })),
                {
                  label: "Custom",
                  icon: <FaCalendarAlt style={{ fontSize: "0.80rem" }} />,
                  onClick: () => handleFilter("date-range"),
                },
              ]}
              className="custom-app-button"
            />
          )}

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
                zIndex: 1050,
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
                  maxWidth: "500px", // limit size for large screens
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
                        onDateRangeChange([startDate, endDate]);
                      }
                      setShowDatePicker(false);
                    }}
                    className="custom-app-button"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          size="sm"
          width="425px"
          className="custom-search-bar"
          style={{
            padding: "0.3rem 0.6rem",
            fontSize: "0.75rem",
          }}
        />
      </div>
      {/* </div> */}
    </>
  );
};

export default ToolBar;
