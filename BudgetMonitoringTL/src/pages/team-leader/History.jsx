import { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";
import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";

const History = () => {
  const [cashHistory, setCashHistory] = useState([]);
  const [liqHistory, setLiqHistory] = useState([]);

  const [searchValueCash, setSearchValueCash] = useState("");
  const [searchValueLiq, setSearchValueLiq] = useState("");
  const [filteredCash, setFilteredCash] = useState([]);
  const [filteredLiq, setFilteredLiq] = useState([]);

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
    setFilteredCash(cashRequests);
    setFilteredLiq(liquidations);
  }, []);

  const handleCashSearch = (val) => {
    setSearchValueCash(val);
    const filtered = cashHistory.filter((item) => isMatch(item, val));
    setFilteredCash(filtered);
  };

  const handleLiqSearch = (val) => {
    setSearchValueLiq(val);
    const filtered = liqHistory.filter((item) => isMatch(item, val));
    setFilteredLiq(filtered);
  };

  const handleCashDateRange = ([start, end]) => {
    const filtered = cashHistory.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= start && date <= end;
    });
    setFilteredCash(filtered);
  };

  const handleLiqDateRange = ([start, end]) => {
    const filtered = liqHistory.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= start && date <= end;
    });
    setFilteredLiq(filtered);
  };

  return (
    <Container fluid className="py-3">
      {/* Cash Request History */}
      <div className="custom-container shadow-sm rounded p-1 mb-3">
        <ToolBar
          searchValue={searchValueCash}
          onSearchChange={(e) => handleCashSearch(e.target.value)}
          onDateRangeChange={handleCashDateRange}
          leftContent={
            <p className="fw-bold mb-0">Cash Request (Approved / Rejected)</p>
          }
          selectedCount={0}
        />
        <DataTable data={filteredCash} columns={columns} hideActions />
      </div>

      {/* Liquidation History */}
      <div className="custom-container shadow-sm rounded p-1">
        <ToolBar
          searchValue={searchValueLiq}
          onSearchChange={(e) => handleLiqSearch(e.target.value)}
          onDateRangeChange={handleLiqDateRange}
          leftContent={<p className="fw-bold mb-0">Liquidation</p>}
          selectedCount={0}
        />
        <DataTable data={filteredLiq} columns={columns} hideActions />
      </div>
    </Container>
  );
};

export default History;
