export const meatballActions = ({ onDelete, onArchive }) => [
  {
    label: "Delete",
    onClick: (entry) => {
      if (window.confirm("Are you sure you want to delete this?")) {
        onDelete(entry);
      }
    },
  },
  {
    label: "Archive",
    onClick: (entry) => {
      if (window.confirm("Are you sure you want to archive this?")) {
        onArchive(entry);
      }
    },
  },
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
