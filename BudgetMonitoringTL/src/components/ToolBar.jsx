import Reaact, { useState } from "react";
import { Container } from "react-bootstrap";
import SearchBar from "./SearchBar";
import AppButton from "./AppButton";
import { FiFilter } from "react-icons/fi";

const ToolBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const onSearchChange = (value) => {
    setSearchValue(value);
  };

  const handlePrint = () => {
    console.log("Print clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleMarkImportant = () => {
    console.log("Marked as Important");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-end align-items-center"
      style={{
        gap: "10px",
        marginBottom: "1rem",
        fontSize: "0.9rem",
        marginTop: "1rem",
      }}
    >
      <AppButton
        isDropdown
        label="Action"
        variant="secondary"
        size="sm"
        className="custom-app-button"
        dropdownItems={[
          { label: "Print", onClick: handlePrint },
          { label: "Delete", onClick: handleDelete },
          { label: "Mark as important", onClick: handleMarkImportant },
        ]}
      />

      <AppButton
        isDropdown
        label={
          <>
            <FiFilter style={{ marginRight: "5px" }} />
            Filter
          </>
        }
        variant="info"
        size="sm"
        className="custom-app-button"
        dropdownItems={[
          { label: "Newest to Oldest", onClick: () => handleFilter("newest") },
          { label: "Oldest to Newest", onClick: () => handleFilter("oldest") },
          { label: "A - Z", onClick: () => handleFilter("az") },
          { label: "Z - A", onClick: () => handleFilter("za") },
          { label: "Category A", onClick: () => handleFilter("categoryA") },
          { label: "Category B", onClick: () => handleFilter("categoryB") },
        ]}
      />

      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        size="sm"
        width="425px"
        style={{
          padding: "0.3rem 0.6rem",
        }}
      />
    </Container>
  );
};

export default ToolBar;
