import Swal from "sweetalert2";
import downloadPDF from "../utils/downloadAsPdf";

// meatball menu
export const meatballActions = ({
  onDelete,
  onArchive,
  onToggleImportant,
  downloadRef,
  setPrintData,
}) => [
  {
    label: "Download",
    onClick: async (entry) => {
      setPrintData(entry);

      setTimeout(async () => {
        await downloadPDF(downloadRef, `entry-${"download"}.pdf`);
      }, 200);
    },
  },
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
export const actionDropdownItems = ({ handleExport }) => [
  { label: "Export", onClick: handleExport },
];

// filter dropdown menu
export const filterDropdownItems = (handleFilter) => [
  {
    label: "Last Month",
    value: "lastMonth",
    onClick: () => handleFilter("latest"),
  },
  {
    label: "This Week",
    value: "thisWeek",
    onClick: () => handleFilter("oldest"),
  },
  {
    label: "This Quarter",
    value: "thisQuarter",
    onClick: () => handleFilter("approved"),
  },
];
