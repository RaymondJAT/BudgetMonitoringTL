import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // load from localStorage
  useEffect(() => {
    const storedImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];
    setImportantItems(storedImportant);
  }, []);

  const handleRestore = (entryToRestore) => {
    // Remove from important
    const updatedImportant = importantItems.filter(
      (item) => item.id !== entryToRestore.id
    );
    setImportantItems(updatedImportant);
    localStorage.setItem(LOCAL_KEY_IMPORTANT, JSON.stringify(updatedImportant));

    // Add to active
    const currentActive =
      JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
    const newActive = [...currentActive, entryToRestore];
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(newActive));
  };

  const handleDelete = (entryToDelete) => {
    const updatedImportant = importantItems.filter(
      (item) => item.id !== entryToDelete.id
    );
    setImportantItems(updatedImportant);
    localStorage.setItem(LOCAL_KEY_IMPORTANT, JSON.stringify(updatedImportant));

    const currentTrash =
      JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
    const newTrash = [...currentTrash, entryToDelete];
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(newTrash));
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
