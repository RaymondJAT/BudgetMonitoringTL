import { useState, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import { restoreSingleItem } from "../../utils/restoreSingleItem";
import { columns } from "../../handlers/tableHeader";
import { LOCAL_KEYS } from "../../constants/localKeys";

import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const AdmTrash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");
  const [filteredData, setFilteredData] = useState([]);
  const [cashTrash, setCashTrash] = useState([]);
  const [liqTrash, setLiqTrash] = useState([]);

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

  const handleRestore = (entry) => {
    restoreSingleItem({
      entryToRestore: entry,
      sourceItems: activeTab === "cash" ? cashTrash : liqTrash,
      setSourceItems: activeTab === "cash" ? setCashTrash : setLiqTrash,
      localKeySource: LOCAL_KEYS.ADM_TRASH,
      localKeyActive: LOCAL_KEYS.ADM_ACTIVE,
    });
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

    localStorage.setItem(LOCAL_KEYS.ADM_TRASH, JSON.stringify(updatedAll));

    if (activeTab === "cash") setCashTrash(updated);
    else setLiqTrash(updated);

    setFilteredData(updated);
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

export default AdmTrash;
