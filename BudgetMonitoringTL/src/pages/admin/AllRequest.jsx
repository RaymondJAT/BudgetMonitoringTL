import { useState, useEffect, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { columns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const AllRequest = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cashRequests, setCashRequests] = useState([]);
  const [liquidations, setLiquidations] = useState([]);

  useEffect(() => {
    const storedActive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ACTIVE)) || [];

    const cash = storedActive.filter(
      (item) => item.formType === "Cash Request"
    );
    const liq = storedActive.filter((item) => item.formType === "Liquidation");

    setCashRequests(cash);
    setLiquidations(liq);
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
    setFilteredData(key === "cash" ? cashRequests : liquidations);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashRequests : liquidations;
    const filtered = source.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered);
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
          items={filteredData}
          setItems={activeTab === "cash" ? setCashRequests : setLiquidations}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          height="495px"
        />
      </div>
    </Container>
  );
};

export default AllRequest;
