import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "../../components/layout/DataTable";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";

const History = () => {
  const [cashHistory, setCashHistory] = useState([]);
  const [liqHistory, setLiqHistory] = useState([]);

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

  return (
    <Container fluid className="py-3">
      {/* Cash Request History */}
      <div className="custom-container shadow-sm rounded p-3 mb-3">
        <p className="fw-bold mb-3">Cash Request (Approved / Rejected)</p>
        <DataTable data={cashHistory} columns={columns} hideActions />
      </div>

      {/* Liquidation History */}
      <div className="custom-container shadow-sm rounded p-3">
        <p className="fw-bold mb-3"> Liquidation</p>
        <DataTable data={liqHistory} columns={columns} hideActions />
      </div>
    </Container>
  );
};

export default History;
