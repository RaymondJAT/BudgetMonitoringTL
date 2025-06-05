import { Container } from "react-bootstrap";
import { FaFilter, FaFileExport } from "react-icons/fa";
import { filterDropdownItems } from "../../handlers/actionMenuItems";
import SearchBar from "../ui/SearchBar";
import AppButton from "../ui/AppButton";

const ToolBar = ({
  searchValue,
  onSearchChange,
  leftContent,
  handleExport,
  selectedCount,
}) => {
  const handleFilter = (type) => console.log("Filter by:", type);

  return (
    <Container
      fluid
      className="d-flex justify-content-between align-items-center"
      style={{
        gap: "10px",
        marginBottom: "1rem",
        fontSize: "0.9rem",
        marginTop: "1rem",
      }}
    >
      {/* print & delete button */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        {leftContent}

        {selectedCount > 0 && (
          <AppButton
            label={
              <>
                <FaFileExport style={{ marginRight: "5px" }} /> Export
              </>
            }
            variant="outline-dark"
            size="sm"
            onClick={handleExport}
            className="custom-app-button"
          />
        )}
      </div>

      {/* actions, filter, search bar */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <AppButton
          isDropdown
          label={
            <>
              <FaFilter style={{ marginRight: "5px" }} />
              Filter
            </>
          }
          variant="outline-dark"
          size="sm"
          className="custom-app-button"
          dropdownItems={filterDropdownItems(handleFilter)}
        />

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
    </Container>
  );
};

export default ToolBar;
