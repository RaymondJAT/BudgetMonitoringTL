// src/hooks/useExpenseDataLoader.js

import { useEffect } from "react";

const useExpenseDataLoader = ({
  setTableData,
  LOCAL_KEY_ACTIVE,
  LOCAL_KEY_ARCHIVE,
  LOCAL_KEY_IMPORTANT,
  LOCAL_KEY_TRASH,
  mockData = [],
}) => {
  useEffect(() => {
    const getDataFromStorage = (key) =>
      JSON.parse(localStorage.getItem(key)) || [];

    const activeData = getDataFromStorage(LOCAL_KEY_ACTIVE);
    const archiveData = getDataFromStorage(LOCAL_KEY_ARCHIVE);
    const importantData = getDataFromStorage(LOCAL_KEY_IMPORTANT);
    const trashData = getDataFromStorage(LOCAL_KEY_TRASH);

    const combinedData = [
      ...activeData,
      ...archiveData,
      ...importantData,
      ...trashData,
    ];

    const seen = new Set();
    const uniqueData = combinedData.filter((item) => {
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        return true;
      }
      return false;
    });

    setTableData(uniqueData.length > 0 ? uniqueData : mockData);
  }, [
    LOCAL_KEY_ACTIVE,
    LOCAL_KEY_ARCHIVE,
    LOCAL_KEY_IMPORTANT,
    LOCAL_KEY_TRASH,
    mockData,
    // ❌ no setTableData here
  ]);
};

export default useExpenseDataLoader;
