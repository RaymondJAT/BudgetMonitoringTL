import Swal from "sweetalert2";
import downloadPDF from "../utils/downloadAsPdf";
import { FaFileDownload, FaTrash, FaArchive, FaBookmark } from "react-icons/fa";

export const meatballActions = ({
  onDelete,
  onArchive,
  onToggleImportant,
  downloadRef,
  setPrintData,
}) => [
  {
    label: "Download",
    Icon: FaFileDownload,
    iconProps: { className: "me-2" },
    onClick: async (entry) => {
      setPrintData(entry);
      setTimeout(async () => {
        await downloadPDF(downloadRef, `entry-${"download"}.pdf`);
      }, 200);
    },
  },
  {
    label: "Delete",
    Icon: FaTrash,
    iconProps: { className: "me-2" },
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
    Icon: FaArchive,
    iconProps: { className: "me-2" },
    onClick: (entry) => {
      onArchive(entry);
      Swal.fire("Archived!", "The entry has been archived.", "success");
    },
  },
  {
    label: "Mark as Important",
    Icon: FaBookmark,
    iconProps: { className: "me-2" },
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

// PROGRESS BAR
export const progressSteps = [
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "review" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
];
