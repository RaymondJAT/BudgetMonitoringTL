import { useState, useEffect, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { MdRestore } from "react-icons/md";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";
import AppButton from "../../components/ui/AppButton";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { expenseHeaders } from "../../handlers/columnHeaders";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { restoreItems } from "../../utils/restoreItems";

const FnceTrash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cashTrash, setCashTrash] = useState([]);
  const [liqTrash, setLiqTrash] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const storedTrash =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_TRASH)) || [];

    const cash = storedTrash.filter((item) => item.formType === "Cash Request");
    const liq = storedTrash.filter((item) => item.formType === "Liquidation");

    setCashTrash(cash);
    setLiqTrash(liq);
    setFilteredData(cash); // default view
  }, []);

  const filteredColumns = useMemo(
    () =>
      expenseHeaders.filter(
        (col) => col.accessor !== "price" && col.accessor !== "quantity"
      ),
    []
  );

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue("");
    setSelectedItems([]);
    setFilteredData(key === "cash" ? cashTrash : liqTrash);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashTrash : liqTrash;
    const filtered = source.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashTrash : liqTrash,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      localKeySource: LOCAL_KEYS.FNCE_TRASH,
      localKeyActive: LOCAL_KEYS.FNCE_ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handlePermanentDelete = (entry) => {
    const updated =
      activeTab === "cash"
        ? cashTrash.filter((item) => item.id !== entry.id)
        : liqTrash.filter((item) => item.id !== entry.id);

    const updatedAll = [
      ...updated,
      ...(activeTab === "cash" ? liqTrash : cashTrash),
    ];

    localStorage.setItem(LOCAL_KEYS.FNCE_TRASH, JSON.stringify(updatedAll));

    if (activeTab === "cash") setCashTrash(updated);
    else setLiqTrash(updated);

    setFilteredData(updated);
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      selectedItems,
      setSelectedItems,
      localKeySource: LOCAL_KEYS.FNCE_TRASH,
      localKeyActive: LOCAL_KEYS.FNCE_ACTIVE,
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
          items={filteredData}
          setItems={activeTab === "cash" ? setCashTrash : setLiqTrash}
          showRestore
          showDelete
          onRestore={handleRestore}
          onDelete={handlePermanentDelete}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </Container>
  );
};

export default FnceTrash;
