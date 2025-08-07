const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

export const revolvingFundColumns = [
  { label: "ID", accessor: "id" },
  { label: "Budget Name", accessor: "name" },
  { label: "Start Date", accessor: "start_date" },
  { label: "End Date", accessor: "end_date" },

  {
    label: "Beginning",
    accessor: "beginning",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Added",
    accessor: "added",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Total Fund",
    accessor: "total_fund",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Issued",
    accessor: "issued",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Returned",
    accessor: "returned",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Reimbursed",
    accessor: "reimbursed",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Outstanding",
    accessor: "outstanding",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Amount Expended",
    accessor: "amount_expended",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Ended",
    accessor: "ending",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Liquidated",
    accessor: "liquidated",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Unliquidated",
    accessor: "unliquidated",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },
  {
    label: "Balance",
    accessor: "balance",
    Cell: ({ value }) => pesoFormatter.format(value || 0),
  },

  { label: "Status", accessor: "status" },
  { label: "Actions", accessor: "actions" },
];

export const cashDisbursementColumns = [
  { label: "ID", accessor: "id" },
  { label: "Revolving Fund", accessor: "revolvingFund" },
  { label: "Date Issue", accessor: "dateIssue" },
  { label: "Received By", accessor: "receivedBy" },
  { label: "Department", accessor: "department" },
  { label: "Particulars", accessor: "particulars" },
  { label: "Cash Voucher", accessor: "cashVoucher" },
  { label: "Amount Issue", accessor: "amountIssue" },
  { label: "Amount Return", accessor: "amountReturn" },
  { label: "Amount Reimburse", accessor: "amountReimburse" },
  { label: "Amount Expended", accessor: "amountExpended" },
  { label: "Outstanding Amount", accessor: "outstandingAmount" },
  { label: "Status", accessor: "status" },
  { label: "Date Liquidated", accessor: "dateLiquidated" },
  { label: "Actions", accessor: "actions" },
];
