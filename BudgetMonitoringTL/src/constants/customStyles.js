// CENTRALIZED STYLE FOR REACT-SELECT
export const customStyles = {
  control: (base) => ({
    ...base,
    fontSize: "0.75rem",
    minHeight: "30px",
    color: "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: "black",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    fontSize: "0.75rem",
    backgroundColor: isSelected ? "#800000" : isFocused ? "#f8d7da" : "white",
    color: isSelected ? "white" : "black",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "150px",
    overflowY: "auto",
  }),
};
