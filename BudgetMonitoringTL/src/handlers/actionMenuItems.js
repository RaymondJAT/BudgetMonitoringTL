import downloadPDF from "../utils/downloadAsPdf";
import { FaFileDownload } from "react-icons/fa";

export const meatballActions = ({ downloadRef, setPrintData }) => [
  {
    label: "Download",
    Icon: FaFileDownload,
    iconProps: { className: "me-2" },
    onClick: async (entry) => {
      setPrintData(entry);
      setTimeout(async () => {
        await downloadPDF(downloadRef, `cash-request-${entry.cv_number}.pdf`);
      }, 200);
    },
  },
];

// actions dropdown menu
export const actionDropdownItems = ({ handleExport }) => [
  { label: "Export", onClick: handleExport },
];

// PROGRESS BAR
export const progressSteps = [
  { label: "Submitted", value: "submitted" },
  { label: "Approved", value: "approved" },
  { label: "Under Review", value: "review" },
  { label: "Completed", value: "completed" },
];
