import { useState, useEffect, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { columns } from "../../handlers/tableHeader";
import { MdRestore } from "react-icons/md";
import { restoreItems } from "../../utils/restoreItems";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { deleteSingleItem } from "../../utils/deleteSingleItem";
import EntryStates from "../../components/layout/EntryStates";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";

const Archive = () => {
  const [cashArchives, setCashArchives] = useState([]);
  const [liqArchives, setLiqArchives] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const trashData = JSON.parse(localStorage.getItem(LOCAL_KEYS.TRASH)) || [];

    const cleanArchive = archiveData.filter(
      (item) => !trashData.find((trash) => trash.id === item.id)
    );

    const cash = cleanArchive.filter(
      (item) => item.formType === "Cash Request"
    );
    const liq = cleanArchive.filter((item) => item.formType === "Liquidation");

    setCashArchives(cash);
    setLiqArchives(liq);
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
    setFilteredData(key === "cash" ? cashArchives : liqArchives);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashArchives : liqArchives;
    const filtered = source.filter((item) =>
      columns.some((col) =>
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
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.ARCHIVE,
      localKeyActive: LOCAL_KEYS.ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.ARCHIVE,
      localKeyTrash: LOCAL_KEYS.TRASH,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestoreSelected = () => {
    restoreItems({
      sourceItems: filteredData,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.ARCHIVE,
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
          items={filteredData}
          setItems={activeTab === "cash" ? setCashArchives : setLiqArchives}
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

export default Archive;
