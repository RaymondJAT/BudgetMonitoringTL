import { Table } from "react-bootstrap";

const CashApprovalTable = ({ total }) => {
  return (
    <Table responsive className="custom-table">
      <thead className="tableHead text-center">
        <tr>
          <th>Amount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody className="tableBody text-center">
        <tr>
          <td>
            ₱
            {parseFloat(total || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </td>
          <td>
            ₱
            {parseFloat(total || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CashApprovalTable;
