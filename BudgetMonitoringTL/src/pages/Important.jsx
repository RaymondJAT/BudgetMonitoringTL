import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { importantColumns } from "../handlers/columnHeaders";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../utils/restoreItems";
import EntryStates from "../components/layout/EntryStates";
import ToolBar from "../components/layout/ToolBar";
import AppButton from "../components/ui/AppButton";
import Swal from "sweetalert2";
import { restoreSingleEntry } from "../utils/restoreSingleItem";

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

  const handleRestore = () => {
    restoreSingleEntry({
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

  const handleDelete = async (entryToDelete) => {
    const result = await Swal.fire({
      title: "Delete Entry?",
      text: "This entry will be moved to Trash.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      const updatedImportant = importantItems.filter(
        (item) => item.id !== entryToDelete.id
      );
      setImportantItems(updatedImportant);
      localStorage.setItem(
        LOCAL_KEY_IMPORTANT,
        JSON.stringify(updatedImportant)
      );

      const currentTrash =
        JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
      const newTrash = [...currentTrash, entryToDelete];
      localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(newTrash));

      Swal.fire("Deleted!", "The entry has been moved to Trash.", "success");
    }
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
