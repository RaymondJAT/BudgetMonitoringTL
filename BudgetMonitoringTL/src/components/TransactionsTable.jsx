import { Container, Table } from "react-bootstrap";

const TransactionsTable = () => {
  return (
    <>
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <Table hover className="expense-table mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.type}</td>
                    <td>{tx.referenceId || "—"}</td>
                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tx.description || "—"}
                    </td>
                    <td>
                      ₱{" "}
                      {parseFloat(tx.amount || 0).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${String(
                          tx.status
                        ).toLowerCase()}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td>{tx.date || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default TransactionsTable;
