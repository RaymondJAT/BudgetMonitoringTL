export const actionDropdownItems = (handlers) => [
  { label: "Approve", onClick: handlers.handlePrint },
  { label: "Reject", onClick: handlers.handleDelete },
  { label: "Mark as important", onClick: handlers.handleMarkImportant },
  { label: "Export", onClick: () => console.log("Export clicked") },
];

export const filterDropdownItems = (handleFilter) => [
  { label: "A - Z", onClick: () => handleFilter("az") },
  { label: "Z - A", onClick: () => handleFilter("za") },
  { label: "Newest to Oldest", onClick: () => handleFilter("newest") },
  { label: "Oldest to Newest", onClick: () => handleFilter("oldest") },
];
