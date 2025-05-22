import { useEffect } from "react";

const useExpenseDataLoader = ({
  setTableData,
  LOCAL_KEY_ACTIVE,
  LOCAL_KEY_ARCHIVE,
  LOCAL_KEY_IMPORTANT,
  LOCAL_KEY_TRASH,
  mockData,
}) => {
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_KEY_ACTIVE);
    const storedTrash = localStorage.getItem(LOCAL_KEY_TRASH);
    let parsedData = [];
    let trashData = [];

    try {
      parsedData = JSON.parse(storedData) || [];
    } catch {
      parsedData = [];
    }

    try {
      trashData = JSON.parse(storedTrash) || [];
    } catch {
      trashData = [];
    }

    if (parsedData.length > 0) {
      setTableData(parsedData);
    } else {
      const storedArchive = localStorage.getItem(LOCAL_KEY_ARCHIVE);
      let archiveData = [];

      try {
        archiveData = JSON.parse(storedArchive) || [];
      } catch {
        archiveData = [];
      }

      const storedImportant = localStorage.getItem(LOCAL_KEY_IMPORTANT);
      let importantData = [];

      try {
        importantData = JSON.parse(storedImportant) || [];
      } catch {
        importantData = [];
      }

      const filteredMockData = mockData.filter(
        (item) =>
          !trashData.find((trash) => trash.id === item.id) &&
          !archiveData.find((archived) => archived.id === item.id) &&
          !importantData.find((important) => important.id === item.id)
      );

      setTableData(filteredMockData);
      localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(filteredMockData));
    }
  }, []);
};

export default useExpenseDataLoader;
