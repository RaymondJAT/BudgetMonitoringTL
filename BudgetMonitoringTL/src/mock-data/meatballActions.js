export const meatballActions = [
  { label: "Delete", onClick: (entry) => console.log("Delete", entry) },
  { label: "Duplicate", onClick: (entry) => console.log("Duplicate", entry) },
  { label: "Download", onClick: (entry) => console.log("Download", entry) },
  {
    label: "Mark as Important",
    onClick: (entry) => console.log("Mark", entry),
  },
  {
    label: "Change Status",
    onClick: (entry) => console.log("Change Status", entry),
  },
  { label: "Print", onClick: (entry) => console.log("Print", entry) },
];
