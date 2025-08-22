import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "../../components/layout/DataTable";
import {
  disbursementHistory,
  revolvingHistory,
} from "../../constants/historyColumn";

const History = () => {
  const [cashDisbursementData, setCashDisbursementData] = useState([]);
  const [revolvingFundData, setRevolvingFundData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch histories
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true);

        const [disbursementRes, revolvingRes] = await Promise.all([
          fetch(
            "/api/cash_disbursement_activity/getcash_disbursement_activity"
          ),
          fetch("/api/revolving_fund_activity/getrevolving_fund_activity"),
        ]);

        const disbursementJson = await disbursementRes.json();
        const revolvingJson = await revolvingRes.json();

        setCashDisbursementData(disbursementJson?.data || []);
        setRevolvingFundData(revolvingJson?.data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  return (
    <div className="p-3">
      {/*  CASH DISBURSEMENT HISTORY */}
      <Row className="mb-4">
        <Col>
          <h5 className="fw-bold mb-2">📑 Cash Disbursement History</h5>
          <DataTable
            data={cashDisbursementData}
            columns={disbursementHistory}
            height="300px"
            showActions={false}
            showCheckbox={false}
          />
          {loading && <div className="text-center mt-2">Loading...</div>}
        </Col>
      </Row>

      {/*  REVOLVING FUND HISTORY */}
      <Row>
        <Col>
          <h5 className="fw-bold mb-2">💰 Revolving Fund History</h5>
          <DataTable
            data={revolvingFundData}
            columns={revolvingHistory}
            height="300px"
            showActions={false}
            showCheckbox={false}
          />
          {loading && <div className="text-center mt-2">Loading...</div>}
        </Col>
      </Row>
    </div>
  );
};

export default History;
