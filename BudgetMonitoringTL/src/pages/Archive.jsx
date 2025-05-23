import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EntryStates from "../components/EntryStates";
import ToolBar from "../components/ToolBar";
import { archiveColumns } from "../mock-data/columnHeaders";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";
const LOCAL_KEY_ARCHIVE = "archiveData";

const Archive = () => {
  const [archiveItems, setArchiveItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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

  const handleRestore = async (entryToRestore) => {
    const result = await Swal.fire({
      title: "Restore Entry?",
      text: "This entry will be moved back to Active.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore it",
    });

    if (result.isConfirmed) {
      const updatedArchive = archiveItems.filter(
        (item) => item.id !== entryToRestore.id
      );
      setArchiveItems(updatedArchive);
      localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(updatedArchive));

      const currentActive =
        JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
      const newActive = [...currentActive, entryToRestore];
      localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(newActive));

      Swal.fire("Restored!", "The entry has been moved to Active.", "success");
    }
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
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <EntryStates
        columns={archiveColumns}
        items={filteredItems}
        setItems={setArchiveItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Archive;
