import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { importantColumns } from "../mock-data/columnHeaders";
import EntryStates from "../components/EntryStates";
import ToolBar from "../components/ToolBar";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_IMPORTANT = "importantData";
const LOCAL_KEY_TRASH = "trashData";

const Important = () => {
  const [searchValue, setSearchValue] = useState("");
  const [importantItems, setImportantItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];
    setImportantItems(storedImportant);
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
      const updatedImportant = importantItems.filter(
        (item) => item.id !== entryToRestore.id
      );
      setImportantItems(updatedImportant);
      localStorage.setItem(
        LOCAL_KEY_IMPORTANT,
        JSON.stringify(updatedImportant)
      );

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
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <EntryStates
        columns={importantColumns}
        items={filteredItems}
        setItems={setImportantItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Important;
