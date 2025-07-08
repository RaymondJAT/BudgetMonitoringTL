import { useState } from "react";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

import { expenseHeaders } from "../../handlers/columnHeaders";

const FnceArchive = () => {
  const [searchValue, setSearchValue] = useState("");
  const [archiveItems, setArchiveItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const filteredItems = archiveItems.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div>
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <EntryStates
        columns={expenseHeaders}
        items={filteredItems}
        setItems={setArchiveItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
};

export default FnceArchive;
