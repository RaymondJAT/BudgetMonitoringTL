const SearchBar = ({
  value,
  onChange,
  size = "md",
  width, // optional width
  style = {},
  className = "",
  placeholder = "Search...",
}) => {
  const sizeClass =
    size === "sm"
      ? "form-control form-control-sm"
      : size === "lg"
      ? "form-control form-control-lg"
      : "form-control";

  return (
    <input
      type="text"
      className={`${sizeClass} ${className}`}
      style={{
        ...(width ? { width } : {}),
        ...style,
      }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
