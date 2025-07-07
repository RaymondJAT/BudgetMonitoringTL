import { useEffect, useState, useMemo } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";
import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";

const History = () => {
  const [cashHistory, setCashHistory] = useState([]);
  const [liqHistory, setLiqHistory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("cash");

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(value))
    );

  useEffect(() => {
    const activeData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
    const cashRequests = activeData.filter(
      (item) =>
        item.formType === "Cash Request" &&
        (item.status === STATUS.APPROVED || item.status === STATUS.REJECTED)
    );

    const liquidations =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];

    setCashHistory(cashRequests);
    setLiqHistory(liquidations);

    setFilteredData(cashRequests);
  }, []);

  const handleSearch = (val) => {
    setSearchValue(val);
    const source = activeTab === "cash" ? cashHistory : liqHistory;
    const filtered = source.filter((item) => isMatch(item, val));
    setFilteredData(filtered);
  };

  const handleDateRange = ([start, end]) => {
    const source = activeTab === "cash" ? cashHistory : liqHistory;
    const filtered = source.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= start && date <= end;
    });
    setFilteredData(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue("");
    setFilteredData(key === "cash" ? cashHistory : liqHistory);
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
          onDateRangeChange={handleDateRange}
          leftContent={
            <p className="fw-bold mb-0">
              {activeTab === "cash" ? "Cash Request" : "Liquidation"}
            </p>
          }
          selectedCount={0}
        />

        <DataTable data={filteredData} columns={columns} hideActions />
      </div>
    </Container>
  );
};

export default History;
