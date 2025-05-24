import { Container } from "react-bootstrap";
import SearchBar from "./SearchBar";
import AppButton from "./AppButton";
import { FaFilter } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import {
  actionDropdownItems,
  filterDropdownItems,
} from "../mock-data/toolbarActions";

const ToolBar = ({ searchValue, onSearchChange, leftContent }) => {
  const handleApprove = () => console.log("Approve clicked");
  const handleReject = () => console.log("Reject clicked");
  const handleMarkImportant = () => console.log("Marked as Important");
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
      {/* Left content (Print and Delete buttons) */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        {leftContent}
      </div>

      {/* Right content (existing toolbar items) */}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <AppButton
          isDropdown
          label={
            <>
              <IoMdSettings style={{ marginRight: "5px" }} />
              Actions
            </>
          }
          variant="secondary"
          size="sm"
          className="custom-app-button"
          dropdownItems={actionDropdownItems({
            handleApprove,
            handleReject,
            handleMarkImportant,
          })}
        />

        <AppButton
          isDropdown
          label={
            <>
              <FaFilter style={{ marginRight: "5px" }} />
              Filter
            </>
          }
          variant="info"
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
