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

  const filteredItems = trashItems.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div>
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <EntryStates
        trashItems={filteredItems}
        setTrashItems={setTrashItems}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Trash;
