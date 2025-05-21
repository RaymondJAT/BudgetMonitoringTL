import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToolBar from "../components/ToolBar";
import EntryStates from "../components/EntryStates";

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

  const handleRestore = (entry) => {
    // restore logic
    const updatedTrash = trashItems.filter((item) => item.id !== entry.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));
  };

  const handlePermanentDelete = (entry) => {
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

  const trashColumns = [
    { header: "Employee", accessor: "employee" },
    { header: "Department", accessor: "department" },
    { header: "Description", accessor: "description" },
    { header: "Category", accessor: "category" },
    { header: "Paid By", accessor: "paidBy" },
    { header: "Total", accessor: "total" },
    { header: "Status", accessor: "status" },
  ];

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
