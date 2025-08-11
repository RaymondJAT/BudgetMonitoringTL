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
  { label: "Revolving Fund", accessor: "revolving_fund_label" },
  { label: "Date Issue", accessor: "date_issue" },
  { label: "Received By", accessor: "received_by" },
  { label: "Department", accessor: "description" },
  { label: "Particulars", accessor: "particulars" },
  { label: "Cash Voucher", accessor: "cash_voucher" },
  { label: "Amount Issue", accessor: "amount_issue" },
  { label: "Amount Return", accessor: "amount_return" },
  { label: "Amount Reimburse", accessor: "amount_reimburse" },
  { label: "Amount Expended", accessor: "amount_expend" },
  { label: "Outstanding Amount", accessor: "outstanding_amount" },
  { label: "Status", accessor: "status" },
  { label: "Date Liquidated", accessor: "date_liquidated" },
  { label: "Actions", accessor: "actions" },
];
