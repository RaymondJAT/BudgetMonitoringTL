import { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";

import DataTable from "../../components/layout/DataTable";
import {
  disbursementHistory,
  revolvingHistory,
} from "../../constants/historyColumn";

const History = () => {
  const [cashDisbursementData, setCashDisbursementData] = useState([]);
  const [revolvingFundData, setRevolvingFundData] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true);

        const [disbursementRes, revolvingRes] = await Promise.all([
          fetch(
            "/api5001/cash_disbursement_activity/getcash_disbursement_activity"
          ),
          fetch("/api5001/revolving_fund_activity/getrevolving_fund_activity"),
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
    <>
      <Container fluid className="pb-3">
        {/*  REVOLVING FUND HISTORY */}
        <div className="custom-container shadow-sm rounded p-3 mt-3">
          <Row>
            <Col>
              <p className="fw-bold mb-2">Revolving Fund History</p>
              <DataTable
                data={revolvingFundData}
                columns={revolvingHistory}
                height="250px"
                showActions={false}
                showCheckbox={false}
              />
              {loading && <div className="text-center mt-2">Loading...</div>}
            </Col>
          </Row>
        </div>

        {/*  CASH DISBURSEMENT HISTORY */}
        <div className="custom-container shadow-sm rounded p-3 mt-3">
          <Row>
            <Col>
              <p className="fw-bold mb-2">Cash Disbursement History</p>
              <DataTable
                data={cashDisbursementData}
                columns={disbursementHistory}
                height="250px"
                showActions={false}
                showCheckbox={false}
              />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default History;
