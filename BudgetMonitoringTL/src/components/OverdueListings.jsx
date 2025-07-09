import { Table } from "react-bootstrap";

const OverdueListings = ({ data, title, height }) => {
  return (
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
                  <tr key={index}>
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
        </div>
      </div>
    </div>
  );
};

export default OverdueListings;
