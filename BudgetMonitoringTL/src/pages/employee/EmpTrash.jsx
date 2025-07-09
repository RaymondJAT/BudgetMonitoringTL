import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Tabs, Tab } from "react-bootstrap";
import { columns } from "../../handlers/tableHeader";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { LOCAL_KEYS } from "../../constants/localKeys";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";
import AppButton from "../../components/ui/AppButton";

const EmpTrash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cashTrash, setCashTrash] = useState([]);
  const [liqTrash, setLiqTrash] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const storedTrash =
        JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_TRASH)) || [];

      const cash = storedTrash.filter(
        (item) => item.formType === "Cash Request"
      );
      const liq = storedTrash.filter((item) => item.formType === "Liquidation");

      setCashTrash(cash);
      setLiqTrash(liq);
      setFilteredData(activeTab === "cash" ? cash : liq);
    }, 500);

    return () => clearInterval(interval);
  }, [activeTab]);

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

  const handleRestore = (entryToRestore) => {
    restoreSingleItem({
      entryToRestore,
      sourceItems: activeTab === "cash" ? cashTrash : liqTrash,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      localKeySource: LOCAL_KEYS.EMP_TRASH,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
      onRestoreComplete: () => {
        window.dispatchEvent(new Event("expenses-updated"));
      },
    });

    setFilteredData((prev) =>
      prev.filter((item) => item.id !== entryToRestore.id)
    );
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      selectedItems,
      setSelectedItems,
      localKeySource: LOCAL_KEYS.EMP_TRASH,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
    });
  };

  const handlePermanentDelete = (entry) => {
    const updated = filteredData.filter((item) => item.id !== entry.id);
    setFilteredData(updated);
    if (activeTab === "cash") {
      setCashTrash(updated);
    } else {
      setLiqTrash(updated);
    }

    const allTrash = [...cashTrash, ...liqTrash].filter(
      (item) => item.id !== entry.id
    );
    localStorage.setItem(LOCAL_KEYS.EMP_TRASH, JSON.stringify(allTrash));
  };

  const handleRowClick = (entry) => {
    navigate("/employee-details", { state: entry });
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

export default EmpTrash;
