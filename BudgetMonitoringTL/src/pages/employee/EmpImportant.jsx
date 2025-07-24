import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Tabs, Tab } from "react-bootstrap";
import { columns } from "../../handlers/tableHeader";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { restoreItems } from "../../utils/restoreItems";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import { MdRestore } from "react-icons/md";
import AppButton from "../../components/ui/AppButton";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const EmpImportant = () => {
  const [cashImportant, setCashImportant] = useState([]);
  const [liqImportant, setLiqImportant] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_IMPORTANT)) || [];

    const cash = stored.filter((item) => item.formType === "Cash Request");
    const liq = stored.filter((item) => item.formType === "Liquidation");

    setCashImportant(cash);
    setLiqImportant(liq);
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
    setFilteredData(key === "cash" ? cashImportant : liqImportant);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashImportant : liqImportant;
    const filtered = source.filter((item) =>
      filteredColumns.some((col) =>
        String(item[col.accessor] || "")
          .toLowerCase()
          .includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashImportant : liqImportant,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashImportant : liqImportant,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      localKeyTrash: LOCAL_KEYS.EMP_TRASH,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashImportant : setLiqImportant,
      localKeySource: LOCAL_KEYS.EMP_IMPORTANT,
      selectedItems,
      setSelectedItems,
      localKeyActive: LOCAL_KEYS.EMP_ACTIVE,
    });
  };

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
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
          setItems={activeTab === "cash" ? setCashImportant : setLiqImportant}
          onRowClick={handleRowClick}
          showRestore={true}
          showDelete={true}
          onRestore={handleRestore}
          onDelete={handleDelete}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </Container>
  );
};

export default EmpImportant;
