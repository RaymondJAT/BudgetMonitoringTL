import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { archiveColumns } from "../../handlers/columnHeaders";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import EntryStates from "../../components/layout/EntryStates";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";

const LOCAL_KEYS = {
  ACTIVE: "expensesData",
  ARCHIVE: "archiveData",
  TRASH: "trashData",
};

const Archive = () => {
  const [archiveItems, setArchiveItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedArchive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const trashData = JSON.parse(localStorage.getItem(LOCAL_KEYS.TRASH)) || [];

    const filteredArchive = storedArchive.filter(
      (item) => !trashData.find((trash) => trash.id === item.id)
    );

    setArchiveItems(filteredArchive);
  }, []);

  const handleRestore = (entryToRestore) => {
    restoreSingleItem({
      entryToRestore,
      sourceItems: archiveItems,
      setSourceItems: setArchiveItems,
      localKeySource: LOCAL_KEYS.ARCHIVE,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });
  };

  const handleDelete = (entryToDelete) => {
    deleteSingleItem({
      entryToDelete,
      sourceItems: archiveItems,
      setSourceItems: setArchiveItems,
      localKeySource: LOCAL_KEYS.ARCHIVE,
      localKeyTrash: LOCAL_KEYS.TRASH,
    });
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: archiveItems,
      setSourceItems: setArchiveItems,
      localKeySource: LOCAL_KEYS.ARCHIVE,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const filteredItems = archiveItems.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div>
      <ToolBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        leftContent={
          selectedItems.length >= 2 && (
            <AppButton
              label={
                <>
                  <MdRestore style={{ marginRight: "5px" }} />
                  Restore All
                </>
              }
              size="sm"
              className="custom-app-button"
              variant="outline-success"
              onClick={handleRestoreSelected}
            />
          )
        }
      />
      <EntryStates
        columns={archiveColumns}
        items={filteredItems}
        setItems={setArchiveItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handleDelete}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
};

export default Archive;
