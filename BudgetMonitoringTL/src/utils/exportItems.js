import { exportToExcel } from "./exportToExcel";

export const handleExportData = ({
  filteredData,
  selectedRows,
  selectedCount,
  filename = "Export",
}) => {
  let exportData = [];

  if (selectedCount > 0) {
    exportData = filteredData.filter((entry) => selectedRows[entry.id]);
  } else {
    exportData = filteredData;
  }

  if (exportData.length === 0) return;

  const cleanedData = exportData.map(
    ({ transactions, images, cv_number, activities, ...rest }) => rest
  );

  exportToExcel(cleanedData, filename);

  return {};
};
