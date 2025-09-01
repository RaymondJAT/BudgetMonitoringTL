import { useState, useMemo } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";

import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";

const History = () => {
  const [cashHistory] = useState([]);
  const [liqHistory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("cash");

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(value))
    );

  const sourceData = useMemo(() => {
    return activeTab === "cash"
      ? cashHistory.filter(
          (item) =>
            item.formType === "Cash Request" &&
            (item.status === STATUS.APPROVED || item.status === STATUS.REJECTED)
        )
      : liqHistory;
  }, [activeTab, cashHistory, liqHistory]);

  const filteredData = useMemo(() => {
    return sourceData.filter((item) => isMatch(item, searchValue));
  }, [sourceData, searchValue]);

  const handleSearch = (val) => {
    setSearchValue(val);
  };

  const handleDateRange = ([start, end]) => {
    const filtered = sourceData.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= start && date <= end;
    });
    return filtered;
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue("");
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
          onDateRangeChange={handleDateRange}
          selectedCount={0}
        />

        <DataTable data={filteredData} columns={columns} hideActions />
      </div>
    </Container>
  );
};

export default History;
