import Swal from "sweetalert2";

export const deleteSingleItem = async ({
  entryToDelete,
  sourceItems,
  setSourceItems,
  localKeySource,
  localKeyTrash,
}) => {
  const result = await Swal.fire({
    title: "Delete Entry?",
    text: "This entry will be moved to Trash.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
  });

  if (!result.isConfirmed) return;

  const updatedSource = sourceItems.filter(
    (item) => item.id !== entryToDelete.id
  );
  setSourceItems(updatedSource);
  localStorage.setItem(localKeySource, JSON.stringify(updatedSource));

  const currentTrash = JSON.parse(localStorage.getItem(localKeyTrash)) || [];

  const isDuplicate = currentTrash.some((item) => item.id === entryToDelete.id);
  const newTrash = isDuplicate
    ? currentTrash
    : [...currentTrash, entryToDelete];

  localStorage.setItem(localKeyTrash, JSON.stringify(newTrash));

  Swal.fire("Deleted!", "The entry has been moved to Trash.", "success");
};
