import { Container, Table } from "react-bootstrap";

const LatestListings = ({ data, title, height }) => {
  return (
    <>
      <div className="flex-fill d-flex flex-column pb-3">
        <div className="custom-container rounded p-3 shadow-sm d-flex flex-column">
          <p className="mb-0 fw-bold">{title}</p>

          <div
            className="trash-wrapper"
            style={{ maxHeight: height, overflowY: "auto" }}
          >
            <Table hover className="expense-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((entry, index) => (
                    <tr key={index} className="fw-bold">
                      <td>{entry.title}</td>
                      <td>{entry.department}</td>
                      <td>{entry.date}</td>
                      <td>
                        ₱{" "}
                        {parseFloat(entry.amount || 0).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${entry.status.toLowerCase()}`}
                        >
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No overdue liquidations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* ✅ Mobile View */}
            <div className="d-lg-none">
              {data.length > 0 ? (
                data.map((entry, index) => (
                  <div key={index} className="mobile-card">
                    <div className="mobile-card-header d-flex justify-content-between">
                      <span className="fw-bold">{entry.title}</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Department:</span>{" "}
                      <span className="mobile-card-value">
                        {entry.department}
                      </span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Date:</span>{" "}
                      <span className="mobile-card-value">{entry.date}</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Amount:</span>{" "}
                      <span className="mobile-card-value">
                        ₱{" "}
                        {parseFloat(entry.amount || 0).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Status:</span>{" "}
                      <span
                        className={`mobile-card-value status-badge ${entry.status.toLowerCase()}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">
                  No overdue liquidations found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestListings;
