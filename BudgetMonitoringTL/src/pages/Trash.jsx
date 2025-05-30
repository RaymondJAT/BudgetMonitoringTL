import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trashColumns } from "../handlers/columnHeaders";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../utils/restoreItems";
import { restoreSingleItem } from "../utils/restoreSingleItem";
import ToolBar from "../components/layout/ToolBar";
import EntryStates from "../components/layout/EntryStates";
import AppButton from "../components/ui/AppButton";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
    setTrashItems(storedTrash);
  }, []);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handleRestore = (entryToRestore) => {
    restoreSingleItem({
      entryToRestore,
      sourceItems: trashItems,
      setSourceItems: setTrashItems,
      localKeySource: LOCAL_KEY_TRASH,
      localKeyActive: LOCAL_KEY_ACTIVE,
    });
  };

  const handlePermanentDelete = async (entry) => {
    const updatedTrash = trashItems.filter((item) => item.id !== entry.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: trashItems,
      setSourceItems: setTrashItems,
      localKeySource: LOCAL_KEY_TRASH,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEY_ACTIVE,
    });
  };

  const filteredItems = Array.isArray(trashItems)
    ? trashItems.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : [];

  const selectedCount = selectedItems.length;

  return (
    <div>
      <ToolBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        leftContent={
          selectedCount >= 2 && (
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
        columns={trashColumns}
        items={filteredItems}
        setItems={setTrashItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handlePermanentDelete}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
};

export default Trash;
