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
    const activeData = JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];

    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];

    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];

    const trashData = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];

    const allData = [
      ...activeData,
      ...archiveData,
      ...importantData,
      ...trashData,
    ];

    const ids = new Set();
    const uniqueData = allData.filter((item) => {
      if (item && !ids.has(item.id)) {
        ids.add(item.id);
        return true;
      }
      return false;
    });

    setTableData(uniqueData.length > 0 ? uniqueData : mockData);
  }, [
    setTableData,
    LOCAL_KEY_ACTIVE,
    LOCAL_KEY_ARCHIVE,
    LOCAL_KEY_IMPORTANT,
    LOCAL_KEY_TRASH,
    mockData,
  ]);
};

export default useExpenseDataLoader;
