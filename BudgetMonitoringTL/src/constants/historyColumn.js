// BUDGET HISTORY
export const allocationColumns = [
  { label: "Date Issued", accessor: "date_issue" },
  { label: "Cash Voucher", accessor: "cash_voucher" },
  { label: "Received By", accessor: "received_by" },
  { label: "Department", accessor: "description" },
  { label: "Particulars", accessor: "particulars" },
  {
    label: "Amount Issued",
    accessor: "amount_issue",
    Cell: ({ value }) =>
      `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
  },
  { label: "Status", accessor: "status" },
  { label: "Date Liquidated", accessor: "date_liquidated" },
];

// REVOLVING FUND HISTORY
export const revolvingHistory = [
  { label: "ID", accessor: "id" },
  { label: "Revolving Fund ID", accessor: "name" },
  { label: "Remarks", accessor: "remarks" },
  { label: "Date", accessor: "date" },
];

// CASH DISBURSEMENT HISTORY
export const disbursementHistory = [
  { label: "ID", accessor: "id" },
  { label: "Cash Voucher", accessor: "cash_voucher" },
  {
    label: "Amount",
    accessor: "amount",
    Cell: ({ value }) =>
      `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
  },
  { label: "Remarks", accessor: "remarks" },
  { label: "Particulars", accessor: "particulars" },
  { label: "Date", accessor: "date" },
];
