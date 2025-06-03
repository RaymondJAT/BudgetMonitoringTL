import Swal from "sweetalert2";
import { downloadPDF } from "../utils/downloadAsPdf";

// meatball menu
export const meatballActions = ({
  onDelete,
  onArchive,
  onToggleImportant,
  downloadRef,
  setPrintData,
}) => [
  // delete action
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
  // archive action
  {
    label: "Archive",
    onClick: (entry) => {
      onArchive(entry);
      Swal.fire("Archived!", "The entry has been archived.", "success");
    },
  },
  // download action
  {
    label: "Download",
    onClick: async (entry) => {
      // Dynamically set printData before rendering the component
      setPrintData(entry);

      // Wait a bit for printData to update and component to re-render
      setTimeout(async () => {
        await downloadPDF(downloadRef, `entry-${entry.id || "download"}.pdf`);
      }, 200);
    },
  },
  // important action
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
