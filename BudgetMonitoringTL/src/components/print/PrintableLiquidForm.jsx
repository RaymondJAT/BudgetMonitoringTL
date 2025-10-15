import { Container, Row, Col, Table } from "react-bootstrap";

const PrintableLiquidForm = ({ data, contentRef, signatures = {} }) => {
  const transactions = data?.liquidation_items || [];
  const totalAmount = transactions.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <div
      ref={contentRef}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* MAIN CONTENT */}
      <Container
        className="px-0 mt-4 flex-grow-1"
        style={{ fontSize: "0.85rem" }}
      >
        <h3 className="text-center w-100 fw-bold">LIQUIDATION FORM</h3>
        <hr className="mb-1" style={{ borderTop: "1px solid black" }} />

        {/* INFO FIELDS */}
        <Row className="custom-col small mb-3">
          <Col xs={12} md={6} className="mb-2">
            <div className="d-flex align-items-center mb-2">
              <strong className="title text-uppercase">Employee:</strong>
              <p className="ms-2 mb-0">{data?.employee || " "}</p>
            </div>
            <div className="d-flex align-items-center mb-2">
              <strong className="title text-uppercase">Department:</strong>
              <p className="ms-2 mb-0">{data?.department || " "}</p>
            </div>
            <div className="d-flex align-items-center">
              <strong className="title text-uppercase">
                Date of Liquidation:
              </strong>
              <p className="ms-2 mb-0">{data?.created_date || " "}</p>
            </div>
          </Col>

          <Col xs={12} md={6} className="mb-2 text-md-end">
            <div className="d-flex justify-content-md-end align-items-center mb-2">
              <strong className="title text-uppercase">Amount Obtained:</strong>
              <p className="ms-2 mb-0">
                ₱
                {parseFloat(data?.amount_obtained || 0).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
            <div className="d-flex justify-content-md-end align-items-center mb-2">
              <strong className="title text-uppercase">Amount Expended:</strong>
              <p className="ms-2 mb-0">
                ₱
                {parseFloat(data?.amount_expended || 0).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
            <div className="d-flex justify-content-md-end align-items-center">
              <strong className="title text-uppercase">
                Reimburse/Return:
              </strong>
              <p className="ms-2 mb-0">
                ₱
                {parseFloat(data?.reimburse_return || 0).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
          </Col>
        </Row>

        {/* TRANSACTION TABLE */}
        <Row>
          <Col xs={12}>
            <Table bordered className="print-table small">
              <thead>
                <tr className="text-center">
                  <th style={{ width: "100px" }}>Date</th>
                  <th>RT#</th>
                  <th style={{ width: "100px" }}>Store Name</th>
                  <th style={{ width: "180px" }}>Purpose</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Mode of Transportation</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td>{item.date || "-"}</td>
                      <td>{item.rt || "-"}</td>
                      <td>{item.store_name || "-"}</td>
                      <td>{item.particulars || "-"}</td>
                      <td>{item.started_from || "-"}</td>
                      <td>{item.ended_to || "-"}</td>
                      <td>{item.li_mode_of_transportation || "-"}</td>
                      <td>
                        ₱
                        {parseFloat(item.amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No transactions recorded.
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="7" className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td className="text-center">
                    <strong>
                      ₱
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {/* SIGNATURES - pinned at bottom */}
      <Container className="px-0 mt-5">
        <Row className="signature small">
          {[
            { label: "Prepared by", key: "prepared" },
            // { label: "Noted by", key: "noted" },
            // { label: "Checked by", key: "checked" },
            { label: "Verified by", key: "verified" },
            { label: "Approved by", key: "approved" },
          ].map(({ label, key }) => (
            <Col
              key={key}
              className="text-center mb-4"
              style={{ flex: 1, padding: "0 8px" }}
            >
              <p className="mb-0">
                <strong>{label}:</strong>
              </p>
              <div
                className="text-center mt-4 position-relative"
                style={{ height: "100px" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", zIndex: 2 }}>
                    {signatures?.[`${key}Name`] || ""}
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      width: "130px",
                      margin: "2px auto 0 auto",
                    }}
                  ></div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PrintableLiquidForm;
