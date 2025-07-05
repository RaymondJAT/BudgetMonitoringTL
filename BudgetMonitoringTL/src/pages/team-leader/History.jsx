import { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";
import DataTable from "../../components/layout/DataTable";

import SearchBar from "../../components/ui/SearchBar";

const History = ({ searchValue, onSearchChange }) => {
  const [cashHistory, setCashHistory] = useState([]);
  const [liqHistory, setLiqHistory] = useState([]);
  const [searchValueCash, setSearchValueCash] = useState("");
  const [searchValueLiq, setSearchValueLiq] = useState("");

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
  }, []);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    return columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(value))
    );
  };

  const filteredCash = useMemo(
    () => cashHistory.filter((item) => isMatch(item, searchValueCash)),
    [cashHistory, searchValueCash]
  );

  const filteredLiq = useMemo(
    () => liqHistory.filter((item) => isMatch(item, searchValueLiq)),
    [liqHistory, searchValueLiq]
  );

  return (
    <Container fluid className="py-3">
      {/* Cash Request History */}
      <div className="custom-container shadow-sm rounded p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fw-bold mb-0">Cash Request (Approved / Rejected)</p>
          <SearchBar
            size="sm"
            placeholder="Search Cash Requests..."
            className="custom-search-bar"
            value={searchValue}
            onChange={onSearchChange}
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "0.75rem",
            }}
          />
        </div>
        <DataTable data={filteredCash} columns={columns} hideActions />
      </div>

      {/* Liquidation History */}
      <div className="custom-container shadow-sm rounded p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fw-bold mb-0">Liquidation</p>
          <SearchBar
            size="sm"
            placeholder="Search Liquidations..."
            className="custom-search-bar"
            value={searchValue}
            onChange={onSearchChange}
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "0.75rem",
            }}
          />
        </div>
        <DataTable data={filteredLiq} columns={columns} hideActions />
      </div>
    </Container>
  );
};

export default History;
