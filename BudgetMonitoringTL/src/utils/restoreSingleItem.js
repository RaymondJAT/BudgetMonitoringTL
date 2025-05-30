import Swal from "sweetalert2";

export const restoreSingleItem = async ({
  entryToRestore,
  sourceItems,
  setSourceItems,
  localKeySource,
  localKeyActive,
}) => {
  const result = await Swal.fire({
    title: "Restore Entry?",
    text: "This entry will be moved back to Active.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, restore it",
  });

  if (!result.isConfirmed) return;

  const updatedSource = sourceItems.filter(
    (entry) => entry.id !== entryToRestore.id
  );
  setSourceItems(updatedSource);
  localStorage.setItem(localKeySource, JSON.stringify(updatedSource));

  const currentActive = JSON.parse(localStorage.getItem(localKeyActive)) || [];

  const isDuplicate = currentActive.some(
    (entry) => entry.id === entryToRestore.id
  );

  const newActive = isDuplicate
    ? currentActive
    : [...currentActive, entryToRestore];

  localStorage.setItem(localKeyActive, JSON.stringify(newActive));

  Swal.fire("Restored!", "The entry has been moved to Active.", "success");
};
