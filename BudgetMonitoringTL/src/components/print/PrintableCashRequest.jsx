import { useState, useEffect } from "react";
import { Row, Col, Container, Table } from "react-bootstrap";

const PrintableCashRequest = ({
  data,
  amountInWords,
  contentRef,
  signatures = {},
}) => {
  const [dateFiled, setDateFiled] = useState("");

  useEffect(() => {
    setDateFiled(new Date().toLocaleDateString());
  }, []);

  const particulars = data?.items || [];
  const totalAmount = particulars.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <div ref={contentRef}>
      <Container className="px-0 mt-4">
        <h2 className="text-center w-100 fw-bold">CASH REQUEST FORM</h2>
        <hr className="mb-1" style={{ borderTop: "1px solid black" }} />
        {/* Employee Details */}
        <Row className="custom-col small">
          <Col xs={12} md={6} className="mb-2">
            <div className="d-flex align-items-center mb-2">
              <strong className="title">Name:</strong>
              <p className="ms-2 mb-0">{data?.employee || " "}</p>
            </div>
            <div className="d-flex align-items-center">
              <strong className="title">Position:</strong>
              <p className="ms-2 mb-0">{data?.position || " "}</p>
            </div>
          </Col>

          <Col xs={12} md={6} className="mb-2 text-md-end">
            <div className="d-flex justify-content-md-end align-items-center mb-2">
              <strong className="title">Date Filed:</strong>
              <p className="ms-2 mb-0">{data?.expenseDate || " "}</p>
            </div>
            <div className="d-flex justify-content-md-end align-items-center">
              <strong className="title">Department:</strong>
              <p className="ms-2 mb-0">{data?.department || " "}</p>
            </div>
          </Col>
        </Row>

        {/* Particulars Table */}
        <Row>
          <Col xs={12}>
            <Table bordered className="print-table small">
              <thead>
                <tr>
                  <th className="text-center">Particulars</th>
                  <th className="text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {particulars.length > 0 ? (
                  particulars.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {`${item.label} - ${item.quantity} x ₱${(
                          item.price ?? 0
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td className="text-center">
                        ₱
                        {item.amount
                          ? parseFloat(item.amount).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })
                          : "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No particulars added.
                    </td>
                  </tr>
                )}
                <tr className="no-border">
                  <td className="text-end pe-3">
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
                <tr>
                  <td colSpan="2" className="text-start">
                    <strong>Amount in Words:</strong> {amountInWords || "Zero"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Signatures */}
        <Row className="signature mt-4 small">
          {/* Requested by */}
          <Col xs={12} md={4} className="text-center">
            <p className="mb-0">
              <strong>Requested by:</strong>
            </p>
            <div
              className="text-center mt-4 position-relative"
              style={{ height: "100px" }}
            >
              {signatures?.requestedName && (
                <img
                  src={signatures.requestSignature}
                  alt="Signature"
                  style={{
                    height: "80px",
                    position: "absolute",
                    top: "-45px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    opacity: 0.9,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "bold", zIndex: 2 }}>
                  {signatures?.requestedName || ""}
                </div>
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "210px",
                    margin: "2px auto 0 auto",
                  }}
                ></div>
              </div>
            </div>
          </Col>

          {/* Approved by */}
          <Col xs={12} md={4} className="text-center">
            <p className="mb-0">
              <strong>Approved by:</strong>
            </p>
            <div
              className="text-center mt-4 position-relative"
              style={{ height: "100px" }}
            >
              {signatures?.approved && (
                <img
                  src={signatures.approved}
                  alt="Signature"
                  style={{
                    height: "80px",
                    position: "absolute",
                    top: "-45px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    opacity: 0.9,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "bold", zIndex: 2 }}>
                  {signatures?.approvedName || ""}
                </div>
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "210px",
                    margin: "2px auto 0 auto",
                  }}
                ></div>
              </div>
            </div>
          </Col>

          {/* Received by */}
          <Col xs={12} md={4} className="text-center">
            <p className="mb-0">
              <strong>Received by:</strong>
            </p>
            <div
              className="text-center mt-4 position-relative"
              style={{ height: "100px" }}
            >
              {signatures?.received && (
                <img
                  src={signatures.received}
                  alt="Signature"
                  style={{
                    height: "80px",
                    position: "absolute",
                    top: "-45px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    opacity: 0.9,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "bold", zIndex: 2 }}>
                  {signatures?.receivedName || ""}
                </div>
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "210px",
                    margin: "2px auto 0 auto",
                  }}
                ></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrintableCashRequest;
