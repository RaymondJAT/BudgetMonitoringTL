import { Table, Button } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";

const BudgetTable = ({ data, height }) => {
  const renderRows = () =>
    data.map((item) => {
      const remaining = item.allocated - item.used;
      const utilization = ((item.used / item.allocated) * 100).toFixed(2);

      return (
        <tr key={item.id}>
          <td>{item.department}</td>
          <td>₱ {item.allocated.toLocaleString()}</td>
          <td>₱ {item.used.toLocaleString()}</td>
          <td>₱ {remaining.toLocaleString()}</td>
          <td>{utilization}%</td>
          <td>
            <Button
              variant="outline-success"
              size="sm"
              className="me-2"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => console.log("Edit", item)}
            >
              <FaEdit />
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              style={{ padding: "2px 6px", fontSize: "0.75rem" }}
              onClick={() => console.log("View", item)}
            >
              <FaEye />
            </Button>
          </td>
        </tr>
      );
    });

  return (
    <>
      <p className="fw-bold mb-2">🏛️ Department Budget</p>
      <div
        className="table-wrapper overflow-auto"
        style={{ maxHeight: height }}
      >
        <Table hover responsive className="expense-table mb-0">
          <thead>
            <tr>
              <th>Department</th>
              <th>Allocated Budget</th>
              <th>Used Amount</th>
              <th>Remaining</th>
              <th>Utilization (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              renderRows()
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No budget data available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default BudgetTable;
