import Swal from "sweetalert2";

export const meatballActions = ({ onDelete, onArchive }) => [
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
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the entry to archive.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Yes, archive it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onArchive(entry);
          Swal.fire("Archived!", "The entry has been archived.", "success");
        }
      });
    },
  },
  {
    label: "Download",
    onClick: (entry) => console.log("Download", entry),
  },
  {
    label: "Mark as Important",
    onClick: (entry) => console.log("Mark", entry),
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
