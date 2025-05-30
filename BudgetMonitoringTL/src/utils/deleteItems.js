import Swal from "sweetalert2";

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

  const updatedSource = sourceData.filter(
    (entry) => !selectedEntries.some((sel) => sel.id === entry.id)
  );
  setSourceData(updatedSource);

  localStorage.setItem(
    destinationKey,
    JSON.stringify([
      ...new Map(
        [
          ...(JSON.parse(localStorage.getItem(destinationKey)) || []),
          ...selectedEntries,
        ].map((item) => [item.id, item])
      ).values(),
    ])
  );

  setSelectedRows({});
  Swal.fire("Deleted!", "Entries have been moved to Trash.", "success");
};
