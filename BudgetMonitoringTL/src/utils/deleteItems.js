import Swal from "sweetalert2";

export const deleteItems = async ({
  selectedEntries,
  sourceData,
  setSourceData,
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

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No authentication token found.", "error");
      return;
    }

    const res = await fetch("/api5001/cash-request/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: selectedEntries.map((entry) => entry.id),
      }),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const resultData = await res.json();

    const updatedSource = sourceData.filter(
      (entry) => !selectedEntries.some((sel) => sel.id === entry.id)
    );
    setSourceData(updatedSource);

    setSelectedRows({});

    Swal.fire("Deleted!", "Entries have been moved to Trash.", "success");
  } catch (error) {
    console.error("Delete failed:", error);
    Swal.fire("Error", "Failed to delete entries.", "error");
  }
};
