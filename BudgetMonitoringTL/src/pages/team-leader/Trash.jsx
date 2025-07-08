import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "../../handlers/tableHeader";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { LOCAL_KEYS } from "../../constants/localKeys";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";
import AppButton from "../../components/ui/AppButton";
import { Container, Tab, Tabs } from "react-bootstrap";

const Trash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cashTrash, setCashTrash] = useState([]);
  const [liqTrash, setLiqTrash] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrash =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.TRASH)) || [];

    const cash = storedTrash.filter((item) => item.formType === "Cash Request");
    const liq = storedTrash.filter((item) => item.formType === "Liquidation");

    setCashTrash(cash);
    setLiqTrash(liq);
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
    setFilteredItems(key === "cash" ? cashTrash : liqTrash);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashTrash : liqTrash;
    const filtered = source.filter((item) =>
      Object.values(item).some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(val.toLowerCase())
      )
    );
    setFilteredItems(filtered);
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashTrash : liqTrash,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      localKeySource: LOCAL_KEYS.TRASH,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });

    setFilteredItems((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handlePermanentDelete = (entry) => {
    const updated = (activeTab === "cash" ? cashTrash : liqTrash).filter(
      (item) => item.id !== entry.id
    );

    if (activeTab === "cash") {
      setCashTrash(updated);
    } else {
      setLiqTrash(updated);
    }

    const allUpdated = [
      ...updated,
      ...(activeTab === "cash" ? liqTrash : cashTrash),
    ];
    localStorage.setItem(LOCAL_KEYS.TRASH, JSON.stringify(allUpdated));
    setFilteredItems(updated);
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredItems,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      localKeySource: LOCAL_KEYS.TRASH,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });
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
          setItems={activeTab === "cash" ? setCashTrash : setLiqTrash}
          onRowClick={handleRowClick}
          showRestore={true}
          showDelete={true}
          onRestore={handleRestore}
          onDelete={handlePermanentDelete}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </Container>
  );
};

export default Trash;
