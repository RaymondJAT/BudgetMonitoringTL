export const moveEntries = ({
  entriesToMove,
  sourceData,
  setSourceData,
  destinationKey,
  statusUpdate = null,
  avoidDuplicates = false,
}) => {
  const updatedSource = sourceData.filter(
    (entry) => !entriesToMove.some((sel) => sel.id === entry.id)
  );
  setSourceData(updatedSource);

  const destinationData =
    JSON.parse(localStorage.getItem(destinationKey)) || [];

  const filteredNewEntries = avoidDuplicates
    ? entriesToMove.filter(
        (entry) => !destinationData.some((d) => d.id === entry.id)
      )
    : entriesToMove;

  const updatedEntries = statusUpdate
    ? filteredNewEntries.map((entry) => ({ ...entry, status: statusUpdate }))
    : filteredNewEntries;

  localStorage.setItem(
    destinationKey,
    JSON.stringify([...destinationData, ...updatedEntries])
  );
};
