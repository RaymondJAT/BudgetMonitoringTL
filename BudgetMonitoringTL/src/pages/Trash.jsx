import { useEffect, useState } from "react";
import ToolBar from "../components/ToolBar";
import EntryStates from "../components/EntryStates";

const LOCAL_KEY_TRASH = "trashData";

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);

  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
    setTrashItems(storedTrash);
  }, []);

  return (
    <div>
      <ToolBar />
      <EntryStates trashItems={trashItems} setTrashItems={setTrashItems} />
    </div>
  );
};

export default Trash;
