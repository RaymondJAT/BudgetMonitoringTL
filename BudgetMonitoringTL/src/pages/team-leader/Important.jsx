import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "../../handlers/tableHeader";
import { Container, Tab, Tabs } from "react-bootstrap";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import { LOCAL_KEYS } from "../../constants/localKeys";
import EntryStates from "../../components/layout/EntryStates";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";

const Important = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cashImportant, setCashImportant] = useState([]);
  const [liqImportant, setLiqImportant] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];

    const cash = storedImportant.filter(
      (item) => item.formType === "Cash Request"
    );
    const liq = storedImportant.filter(
      (item) => item.formType === "Liquidation"
    );

    setCashImportant(cash);
    setLiqImportant(liq);
    setFilteredItems(cash);
  }, []);

  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (col) => col.accessor !== "price" && col.accessor !== "quantity"
      ),
    []
  );

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue("");
    setSelectedItems([]);
    setFilteredItems(key === "cash" ? cashImportant : liqImportant);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashImportant : liqImportant;
    const filtered = source.filter((item) =>
      Object.values(item).some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(val.toLowerCase())
      )
    );
    setFilteredItems(filtered);
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashImportant : liqImportant,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.IMPORTANT,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });

    setFilteredItems((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashImportant : liqImportant,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.IMPORTANT,
      localKeyTrash: LOCAL_KEYS.TRASH,
    });

    setFilteredItems((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredItems,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.IMPORTANT,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  return (
    <Container fluid className="py-3">
      <div className="custom-container shadow-sm rounded p-2">
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabChange}
          className="mb-3 custom-tabs"
        >
          <Tab eventKey="cash" title="Cash Requests" />
          <Tab eventKey="liquidation" title="Liquidations" />
        </Tabs>

        <ToolBar
          searchValue={searchValue}
          onSearchChange={(e) => handleSearch(e.target.value)}
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
          columns={filteredColumns}
          height="510px"
          items={filteredItems}
          setItems={activeTab === "cash" ? setCashImportant : setLiqImportant}
          onRowClick={handleRowClick}
          showRestore
          showDelete
          onRestore={handleRestore}
          onDelete={handleDelete}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </Container>
  );
};

export default Important;
