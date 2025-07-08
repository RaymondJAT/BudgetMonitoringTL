import { useEffect, useState, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { MdRestore } from "react-icons/md";
import { LOCAL_KEYS } from "../../constants/localKeys";
import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";
import AppButton from "../../components/ui/AppButton";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import { expenseHeaders } from "../../handlers/columnHeaders";

const FnceArchive = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cashArchives, setCashArchives] = useState([]);
  const [liqArchives, setLiqArchives] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const storedArchive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const trashData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_TRASH)) || [];

    const cleanArchive = storedArchive.filter(
      (item) => !trashData.find((trash) => trash.id === item.id)
    );

    const cash = cleanArchive.filter(
      (item) => item.formType === "Cash Request"
    );
    const liq = cleanArchive.filter((item) => item.formType === "Liquidation");

    setCashArchives(cash);
    setLiqArchives(liq);
    setFilteredData(cash); // default tab
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
    setFilteredData(key === "cash" ? cashArchives : liqArchives);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashArchives : liqArchives;
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
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.FNCE_ARCHIVE,
      localKeyActive: LOCAL_KEYS.FNCE_ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.FNCE_ARCHIVE,
      localKeyTrash: LOCAL_KEYS.FNCE_TRASH,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      selectedItems,
      setSelectedItems,
      localKeySource: LOCAL_KEYS.FNCE_ARCHIVE,
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
          setItems={activeTab === "cash" ? setCashArchives : setLiqArchives}
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

export default FnceArchive;
