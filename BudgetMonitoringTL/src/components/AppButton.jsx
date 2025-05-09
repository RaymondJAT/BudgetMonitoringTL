import React from "react";
import { Button, Dropdown } from "react-bootstrap";

const AppButton = ({
  label,
  variant = "primary",
  size = "md",
  isDropdown,
  dropdownItems = [],
  onClick,
  style = {},
}) => {
  if (isDropdown) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant={variant} size={size} style={style}>
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {dropdownItems.map((item, index) => (
            <Dropdown.Item key={index} onClick={item.onClick}>
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Button variant={variant} size={size} onClick={onClick} style={style}>
      {label}
    </Button>
  );
};

export default AppButton;
