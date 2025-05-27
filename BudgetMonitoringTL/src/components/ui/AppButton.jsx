import { Button, Dropdown } from "react-bootstrap";

const AppButton = ({
  label,
  variant = "primary",
  size = "md",
  isDropdown,
  dropdownItems = [],
  onClick,
  className = "",
  style = {},
  children,
}) => {
  if (isDropdown) {
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant={variant}
          size={size}
          className={className}
          style={style}
        >
          {label || children}
        </Dropdown.Toggle>
        <Dropdown.Menu className="custom-dropdown-menu">
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
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children || label}
    </Button>
  );
};

export default AppButton;
