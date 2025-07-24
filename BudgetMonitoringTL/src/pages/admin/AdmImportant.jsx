import { useState, useEffect, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { columns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";
import AppButton from "../../components/ui/AppButton";
import { MdRestore } from "react-icons/md";

const AdmImportant = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cashItems, setCashItems] = useState([]);
  const [liqItems, setLiqItems] = useState([]);

  useEffect(() => {
    const storedImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_IMPORTANT)) || [];

    const cash = storedImportant.filter(
      (item) => item.formType === "Cash Request"
    );
    const liq = storedImportant.filter(
      (item) => item.formType === "Liquidation"
    );

    setCashItems(cash);
    setLiqItems(liq);
    setFilteredData(cash);
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
    setFilteredData(key === "cash" ? cashItems : liqItems);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashItems : liqItems;
    const filtered = source.filter((item) =>
      Object.values(
        item.some((value) =>
          String(value).toLowerCase().includes(val.toLowerCase())
        )
      )
    );
    setFilteredData(filtered);
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashItems : liqItems,
      setSourceItems: activeTab === "cash" ? setCashItems : setLiqItems,
      localKeySource: LOCAL_KEYS.ADM_IMPORTANT,
      localKeyActive: LOCAL_KEYS.ADM_ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashItems : liqItems,
      setSourceItems: activeTab === "cash" ? setCashItems : setLiqItems,
      localKeySource: LOCAL_KEYS.ADM_IMPORTANT,
      localKeyTrash: LOCAL_KEYS.ADM_TRASH,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashItems : setLiqItems,
      selectedItems,
      setSelectedItems,
      localKeySource: LOCAL_KEYS.ADM_IMPORTANT,
      localKeyActive: LOCAL_KEYS.ADM_ACTIVE,
    });
  };

  return (
    <Container fluid className="py-3">
      <div className="custom-container shadow-sm rounded p-3">
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
          height="495px"
          items={filteredData}
          setItems={activeTab === "cash" ? setCashItems : setLiqItems}
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

export default AdmImportant;
