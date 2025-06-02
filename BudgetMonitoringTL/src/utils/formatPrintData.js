export const formatPrintData = (transactions = []) =>
  transactions.map(({ label = "N/A", quantity = 0, price = 0 }) => ({
    label,
    quantity,
    price,
    amount: quantity * price,
  }));
