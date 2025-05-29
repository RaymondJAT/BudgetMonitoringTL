import Swal from "sweetalert2";

// meatball menu
export const meatballActions = ({ onDelete, onArchive, onToggleImportant }) => [
  {
    label: "Delete",
    onClick: (entry) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete(entry);
          Swal.fire("Deleted!", "The entry has been deleted.", "success");
        }
      });
    },
  },
  {
    label: "Archive",
    onClick: (entry) => {
      onArchive(entry);
      Swal.fire("Archived!", "The entry has been archived.", "success");
    },
  },
  {
    label: "Download",
    onClick: (entry) => console.log("Download", entry),
  },
  {
    label: "Mark as Important",
    onClick: (entry) => {
      const isNowImportant = !entry.important;
      onToggleImportant({ ...entry, important: isNowImportant });

      Swal.fire({
        icon: "success",
        title: isNowImportant ? "Marked as Important" : "Unmarked as Important",
        text: `This entry has been ${
          isNowImportant ? "marked" : "unmarked"
        } as important.`,
      });
    },
  },
  {
    label: "Change Status",
    onClick: (entry) => console.log("Change Status", entry),
  },
];

// actions dropdown menu
export const actionDropdownItems = (handlers) => [
  { label: "Export", onClick: handlers.handleExport },
  { label: "Insert in spreadsheet", onClick: handlers.handleInsert },
  { label: "Duplicate", onClick: handlers.handleDuplicate },
];

// filter dropdown menu
export const filterDropdownItems = (handleFilter) => [
  {
    label: "Custom Range (Date Picker)",
    onClick: () => handleFilter("custom"),
  },

  { type: "divider" },

  { label: "Sort by:", type: "header" },
  { label: "Newest to Oldest", onClick: () => handleFilter("newest") },
  { label: "Oldest to Newest", onClick: () => handleFilter("oldest") },
];
