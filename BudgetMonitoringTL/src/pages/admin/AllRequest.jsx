import { useState, useMemo } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import EntryStates from "../../components/layout/EntryStates";

const AllRequest = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("cash");
  const [selectedItems, setSelectedItems] = useState([]);
  const [cashRequests, setCashRequests] = useState([]); 
  const [liquidations, setLiquidations] = useState([]); 

 
  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (col) => col.accessor !== "price" && col.accessor !== "quantity"
      ),
    []
  );

 
  const sourceData = useMemo(
    () => (activeTab === "cash" ? cashRequests : liquidations),
    [activeTab, cashRequests, liquidations]
  );

 
  const filteredData = useMemo(() => {
    if (!searchValue) return sourceData;
    return sourceData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [sourceData, searchValue]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue(""); 
    setSelectedItems([]);
  };

  const handleSearch = (val) => {
    setSearchValue(val);
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
