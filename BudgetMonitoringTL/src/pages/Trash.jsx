import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trashColumns } from "../handlers/columnHeaders";
import Swal from "sweetalert2";
import ToolBar from "../components/layout/ToolBar";
import EntryStates from "../components/layout/EntryStates";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
    setTrashItems(storedTrash);
  }, []);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handleRestore = async (entryToRestore) => {
    const result = await Swal.fire({
      title: "Restore Entry?",
      text: "This entry will be moved back to Active.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore it",
    });
    // restore logic
    if (result.isConfirmed) {
      const updatedTrash = trashItems.filter(
        (item) => item.id !== entryToRestore.id
      );
      setTrashItems(updatedTrash);
      localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));

      const currentActive =
        JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
      const newActive = [...currentActive, entryToRestore];
      localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(newActive));

      Swal.fire("Restored!", "The entry has been moved to Active.", "success");
    }
  };

  const handlePermanentDelete = async (entry) => {
    const updatedTrash = trashItems.filter((item) => item.id !== entry.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));
  };

  const filteredItems = Array.isArray(trashItems)
    ? trashItems.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : [];

  return (
    <div>
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <EntryStates
        columns={trashColumns}
        items={filteredItems}
        setItems={setTrashItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handlePermanentDelete}
      />
    </div>
  );
};

export default Trash;
