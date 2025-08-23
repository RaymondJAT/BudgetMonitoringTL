// BUDGET HISTORY
export const allocateHistory = [
  { label: "ID", accessor: "id" },
  { label: "Date Issue", accessor: "date_issue" },
  { label: "Received By", accessor: "received_by" },
  { label: "Amount Issue", accessor: "amount_issue" },
  { label: "Status", accessor: "status" },
  { label: "Date Liquidated", accessor: "date_liquidated" },
];

// REVOLVING FUND HISTORY
export const revolvingHistory = [
  { label: "ID", accessor: "id" },
  { label: "Revolving Fund ID", accessor: "revolving_fund_id" },
  { label: "Remarks", accessor: "remarks" },
  { label: "Date", accessor: "date" },
];

// CASH DISBURSEMENT HISTORY
export const disbursementHistory = [
  { label: "ID", accessor: "id" },
  { label: "Cash Disbursement ID", accessor: "cash_disbursement_id" },
  { label: "Amount", accessor: "amount" },
  { label: "Remarks", accessor: "remarks" },
  { label: "Particulars", accessor: "particulars" },
  { label: "Date", accessor: "date" },
];

// // Helper: evenly distribute width
// const withEqualWidth = (columns) => {
//   const percent = `${100 / columns.length}%`;
//   return columns.map((col) => ({
//     ...col,
//     width: percent,
//     style: { textAlign: "center" },
//   }));
// };

// // REVOLVING FUND HISTORY
// export const revolvingHistory = withEqualWidth([
//   { label: "ID", accessor: "id" },
//   { label: "Revolving Fund ID", accessor: "revolving_fund_id" },
//   { label: "Remarks", accessor: "remarks" },
//   { label: "Date", accessor: "date" },
// ]);

// // CASH DISBURSEMENT HISTORY
// export const disbursementHistory = withEqualWidth([
//   { label: "ID", accessor: "id" },
//   { label: "Cash Disbursement ID", accessor: "cash_disbursement_id" },
//   { label: "Amount", accessor: "amount" },
//   { label: "Remarks", accessor: "remarks" },
//   { label: "Particulars", accessor: "particulars" },
//   { label: "Date", accessor: "date" },
// ]);
