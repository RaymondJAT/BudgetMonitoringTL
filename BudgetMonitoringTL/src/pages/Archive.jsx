import { useEffect, useState } from "react";
import EntryStates from "../components/EntryStates";
import ToolBar from "../components/ToolBar";
import { useNavigate } from "react-router-dom";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_ARCHIVE = "archiveData";

const Archive = () => {
  const [archiveItems, setArchiveItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedArchive =
      JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
    setArchiveItems(storedArchive);
  }, []);

  const handleRestore = (entryToRestore) => {
    // remove from archive page
    const updatedArchive = archiveItems.filter(
      (item) => item.id !== entryToRestore.id
    );
    setArchiveItems(updatedArchive);
    localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(updatedArchive));

    // add to active expenses in approval
    const currentActive =
      JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
    const newActive = [...currentActive, entryToRestore];
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(newActive));
  };

  const handleDelete = (entryToDelete) => {
    const updatedArchive = archiveItems.filter(
      (item) => item.id !== entryToDelete.id
    );
    setArchiveItems(updatedArchive);
    localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(updatedArchive));
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const filteredItems = archiveItems.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const archiveColumns = [
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
