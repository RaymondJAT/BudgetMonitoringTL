import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { archiveColumns } from "../handlers/columnHeaders";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../utils/restoreItems";
import Swal from "sweetalert2";
import EntryStates from "../components/layout/EntryStates";
import ToolBar from "../components/layout/ToolBar";
import AppButton from "../components/ui/AppButton";
import { restoreSingleEntry } from "../utils/restoreSingleItem";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";
const LOCAL_KEY_ARCHIVE = "archiveData";

const Archive = () => {
  const [archiveItems, setArchiveItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedArchive =
      JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
    const trashData = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];

    const filteredArchive = storedArchive.filter(
      (item) => !trashData.find((trash) => trash.id === item.id)
    );

    setArchiveItems(filteredArchive);
  }, []);

  const handleRestore = () => {
    restoreSingleEntry({
      entryToRestore,
      sourceItems: archiveItems,
      setSourceItems: setArchiveItems,
      localKeySource: LOCAL_KEY_ARCHIVE,
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
      const updatedArchive = archiveItems.filter(
        (item) => item.id !== entryToDelete.id
      );
      setArchiveItems(updatedArchive);
      localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(updatedArchive));

      const currentTrash =
        JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
      const newTrash = [...currentTrash, entryToDelete];
      localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(newTrash));

      Swal.fire("Deleted!", "The entry has been moved to Trash.", "success");
    }
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: archiveItems,
      setSourceItems: setArchiveItems,
      localKeySource: LOCAL_KEY_ARCHIVE,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEY_ACTIVE,
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
