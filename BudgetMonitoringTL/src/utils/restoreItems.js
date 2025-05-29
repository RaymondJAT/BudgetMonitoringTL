import Swal from "sweetalert2";

export const restoreItems = async ({
  sourceItems,
  setSourceItems,
  localKeySource,
  selectedItems,
  setSelectedItems,
  localKeyActive,
}) => {
  const result = await Swal.fire({
    title: "Restore Entries?",
    text: "Selected entries will be moved back to Active.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, restore them",
  });

  if (result.isConfirmed) {
    const updatedSource = sourceItems.filter(
      (item) => !selectedItems.includes(item.id)
    );
    const restoredItems = sourceItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    setSourceItems(updatedSource);
    localStorage.setItem(localKeySource, JSON.stringify(updatedSource));

    const currentActive =
      JSON.parse(localStorage.getItem(localKeyActive)) || [];
    const newActive = [...currentActive, ...restoredItems];
    localStorage.setItem(localKeyActive, JSON.stringify(newActive));

    setSelectedItems([]);

    Swal.fire("Restored!", "Selected entries were moved to Active.", "success");
  }
};
