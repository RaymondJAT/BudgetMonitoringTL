import { LOCAL_KEYS } from "../constants/localKeys";

export const moveEntries = ({
  entriesToMove,
  sourceData,
  setSourceData,
  destinationKey,
  statusUpdate,
  avoidDuplicates = false,
}) => {
  const updatedSource = sourceData.filter(
    (entry) => !entriesToMove.find((e) => e.id === entry.id)
  );

  setSourceData(updatedSource);
  localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updatedSource)); // 🔥 fix here

  const currentDest = JSON.parse(localStorage.getItem(destinationKey)) || [];

  const newDest = entriesToMove.map((entry) => ({
    ...entry,
    ...(statusUpdate && { status: statusUpdate }),
  }));

  const merged =
    avoidDuplicates && destinationKey === LOCAL_KEYS.EMP_IMPORTANT
      ? [
          ...currentDest,
          ...newDest.filter((e) => !currentDest.some((c) => c.id === e.id)),
        ]
      : [...currentDest, ...newDest];

  localStorage.setItem(destinationKey, JSON.stringify(merged));
};
