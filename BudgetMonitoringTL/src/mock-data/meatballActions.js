import Swal from "sweetalert2";

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
  {
    label: "Print",
    onClick: (entry) => console.log("Print", entry),
  },
];
