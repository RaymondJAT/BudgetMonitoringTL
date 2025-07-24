import { useState, useEffect, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { deleteSingleItem } from "../../utils/deleteSingleItem";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { columns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const AdmArchive = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cashArchives, setCashArchives] = useState([]);
  const [liqArchives, setLiqArchives] = useState([]);

  useEffect(() => {
    const storedArchive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ARCHIVE)) || [];
    const trashData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_TRASH)) || [];

    const cleanArchive = storedArchive.filter(
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
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleDelete = (entry) => {
    deleteSingleItem({
      entryToDelete: entry,
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.ADM_ARCHIVE,
      localKeyTrash: LOCAL_KEYS.ADM_TRASH,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashArchives : liqArchives,
      setSourceItems: activeTab === "cash" ? setCashArchives : setLiqArchives,
      localKeySource: LOCAL_KEYS.ADM_ARCHIVE,
      localKeyActive: LOCAL_KEYS.ADM_ACTIVE,
    });

    setFilteredData((prev) => prev.filter((item) => item.id !== entry.id));
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
        />

        <EntryStates
          columns={filteredColumns}
          height="495px"
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

export default AdmArchive;
