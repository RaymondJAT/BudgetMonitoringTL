import { Table } from "react-bootstrap";

const CashApprovalTable = ({ transactions, total }) => {
  return (
    <Table responsive className="custom-table">
      <thead className="tableHead text-center">
        <tr>
          <th>Label</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody className="tableBody text-center">
        {transactions.map((row, index) => (
          <tr key={index}>
            <td>{row.label || "N/A"}</td>
            <td>
              ₱
              {(row.price ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </td>
            <td>{row.quantity ?? 0}</td>
            <td>
              ₱
              {((row.quantity ?? 0) * (row.price ?? 0)).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2 }
              )}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="text-end border-end">
            <strong>Total:</strong>
          </td>
          <td className="text-center border-end">
            <strong>
              ₱
              {total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default CashApprovalTable;
