import React, { useState } from "react";
import { Container } from "react-bootstrap";
import SearchBar from "./SearchBar";
import AppButton from "./AppButton";

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
        dropdownItems={[
          { label: "Print", onClick: handlePrint },
          { label: "Delete", onClick: handleDelete },
          { label: "Mark as important", onClick: handleMarkImportant },
        ]}
        style={{
          padding: "0.3rem 0.5rem",
        }}
      />
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        size="sm"
        width="250px"
        style={{
          padding: "0.3rem 0.6rem",
        }}
      />
    </Container>
  );
};

export default ToolBar;
