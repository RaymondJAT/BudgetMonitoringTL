export const moveEntries = async ({
  entriesToMove,
  sourceData,
  setSourceData,
  destinationKey,
  statusUpdate,
  avoidDuplicates = false,
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    const res = await fetch("/api5001/cash-request/move", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: entriesToMove.map((e) => e.id),
        newStatus: statusUpdate || null,
        destination: destinationKey,
      }),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const resultData = await res.json();

    const updatedSource = sourceData.filter(
      (entry) => !entriesToMove.some((e) => e.id === entry.id)
    );
    setSourceData(updatedSource);
  } catch (error) {
    console.error("Move failed:", error);
  }
};
