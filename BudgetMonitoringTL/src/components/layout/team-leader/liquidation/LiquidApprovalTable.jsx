import { Table } from "react-bootstrap";

const LiquidApprovalTable = ({ transactions, total }) => {
  return (
    <Table responsive className="custom-table">
      <thead className="tableHead text-center">
        <tr>
          <th style={{ width: "90px" }}>Date</th>
          <th style={{ width: "80px" }}>RT#</th>
          <th style={{ width: "200px" }}>Store Name</th>
          <th>Particulars</th>
          <th style={{ width: "150px" }}>From</th>
          <th style={{ width: "150px" }}>To</th>
          <th style={{ width: "200px" }}>Mode of Transportation</th>
          <th style={{ width: "90px" }}>Amount</th>
        </tr>
      </thead>

      <tbody className="tableBody text-center">
        {transactions.map((row, index) => (
          <tr key={index}>
            <td>{row.date || "N/A"}</td>
            <td>{row.rt || "N/A"}</td>
            <td>{row.store_name || "N/A"}</td>
            <td>{row.particulars || "N/A"}</td>
            <td>{row.from || "N/A"}</td>
            <td>{row.to || "N/A"}</td>
            <td>{row.mode_of_transportation || "N/A"}</td>
            <td>
              ₱
              {(row.amount ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="7" className="text-end border-end">
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

export default LiquidApprovalTable;
