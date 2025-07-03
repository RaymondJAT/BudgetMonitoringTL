import Swal from "sweetalert2";
import { LOCAL_KEYS } from "../constants/localKeys";

export const deleteItems = async ({
  selectedEntries,
  sourceData,
  setSourceData,
  destinationKey,
  setSelectedRows,
}) => {
  if (!selectedEntries || selectedEntries.length === 0) return;

  const result = await Swal.fire({
    title: `Delete ${selectedEntries.length} selected entr${
      selectedEntries.length === 1 ? "y" : "ies"
    }?`,
    text: "This action will move them to Trash. Do you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
  });

  if (!result.isConfirmed) return;

  // 🔧 1. Remove from source
  const updatedSource = sourceData.filter(
    (entry) => !selectedEntries.some((sel) => sel.id === entry.id)
  );
  setSourceData(updatedSource);

  // 🔧 2. Persist ACTIVE update in localStorage
  localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updatedSource));

  // 🔧 3. Merge into Trash (deduplicated by ID)
  const existingTrash = JSON.parse(localStorage.getItem(destinationKey)) || [];

  const merged = [
    ...new Map(
      [...existingTrash, ...selectedEntries].map((item) => [item.id, item])
    ).values(),
  ];

  localStorage.setItem(destinationKey, JSON.stringify(merged));

  // 🔧 4. Reset selected rows
  setSelectedRows({});

  Swal.fire("Deleted!", "Entries have been moved to Trash.", "success");
};
