import { Container, Table } from "react-bootstrap";

const LatestListings = ({ data, title, height }) => {
  return (
    <>
      <Container fluid>
        <div className="flex-fill d-flex flex-column mb-3">
          <div className="custom-container flex-grow-1 p-3 rounded shadow-sm d-flex flex-column">
            <p className="mb-3 fw-bold">{title}</p>
            <div
              className="table-wrapper flex-grow-1 overflow-auto"
              style={{ maxHeight: height }}
            >
              <Table hover className="expense-table mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reference ID</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.type}</td>
                        <td>{entry.referenceId}</td>
                        <td>{entry.employee}</td>
                        <td>{entry.department}</td>
                        <td>{entry.description}</td>
                        <td>
                          ₱{" "}
                          {parseFloat(entry.amount || 0).toLocaleString(
                            "en-PH",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${String(
                              entry.status
                            ).toLowerCase()}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td>{entry.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No recent listings available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LatestListings;
