import Swal from "sweetalert2";

export const restoreSingleItem = async ({
  entryToRestore,
  sourceItems,
  setSourceItems,
  localKeySource,
  localKeyActive,
  onRestoreComplete,
}) => {
  const result = await Swal.fire({
    title: "Restore Entry?",
    text: "This entry will be moved back to Active.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, restore it",
  });

  if (!result.isConfirmed) return;

  // ✅ Retain original status (no override)
  const restoredEntry = { ...entryToRestore };

  // ✅ Remove from source (Trash)
  const updatedSource = sourceItems.filter(
    (entry) => entry.id !== restoredEntry.id
  );
  setSourceItems(updatedSource);
  localStorage.setItem(localKeySource, JSON.stringify(updatedSource));

  // ✅ Add to ACTIVE storage
  const currentActive = JSON.parse(localStorage.getItem(localKeyActive)) || [];

  const isDuplicate = currentActive.some(
    (entry) => entry.id === restoredEntry.id
  );

  const newActive = isDuplicate
    ? currentActive
    : [...currentActive, restoredEntry];

  localStorage.setItem(localKeyActive, JSON.stringify(newActive));

  // ✅ Notify + trigger refresh
  Swal.fire("Restored!", "The entry has been moved to Active.", "success");
  window.dispatchEvent(new Event("expenses-updated"));

  if (onRestoreComplete) onRestoreComplete();
};
