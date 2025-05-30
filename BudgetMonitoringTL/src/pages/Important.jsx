import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { importantColumns } from "../handlers/columnHeaders";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../utils/restoreItems";
import { restoreSingleItem } from "../utils/restoreSingleItem";
import { deleteSingleItem } from "../utils/deleteSingleItem";
import EntryStates from "../components/layout/EntryStates";
import ToolBar from "../components/layout/ToolBar";
import AppButton from "../components/ui/AppButton";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_IMPORTANT = "importantData";
const LOCAL_KEY_TRASH = "trashData";

const Important = () => {
  const [searchValue, setSearchValue] = useState("");
  const [importantItems, setImportantItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];
    setImportantItems(storedImportant);
  }, []);

  const handleRestore = (entryToRestore) => {
    restoreSingleItem({
      entryToRestore,
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      localKeySource: LOCAL_KEY_IMPORTANT,
      localKeyActive: LOCAL_KEY_ACTIVE,
    });
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      localKeySource: LOCAL_KEY_IMPORTANT,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEY_ACTIVE,
    });
  };

  const handleDelete = (entryToDelete) => {
    deleteSingleItem({
      entryToDelete,
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      localKeySource: LOCAL_KEY_IMPORTANT,
      localKeyTrash: LOCAL_KEY_TRASH,
    });
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const filteredItems = importantItems.filter((item) =>
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
        columns={importantColumns}
        items={filteredItems}
        setItems={setImportantItems}
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

export default Important;
