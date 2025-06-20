import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeImportantColumns } from "../../handlers/columnHeaders";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { restoreItems } from "../../utils/restoreItems";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import { MdRestore } from "react-icons/md";
import AppButton from "../../components/ui/AppButton";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const EmpImportant = () => {
  const [importantItems, setImportantItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmpImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_IMPORTANT)) || [];
    setImportantItems(storedEmpImportant);
  }, []);

  const handleRestore = (entryToRestore) => {
    restoreSingleItem({
      entryToRestore,
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
    });
  };

  const handleDelete = (entryToDelete) => {
    deleteSingleItem({
      entryToDelete,
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      localKeyTrash: LOCAL_KEYS.EMP_TRASH,
    });
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: importantItems,
      setSourceItems: setImportantItems,
      selectedItems,
      setSelectedItems,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
    });
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
    <>
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
        columns={employeeImportantColumns}
        items={filteredItems}
        setItems={setImportantItems}
        onRowClick={handleRowClick}
        showRestore={true}
        showDelete={true}
        onRestore={handleRestore}
        onDelete={handleDelete}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </>
  );
};

export default EmpImportant;
