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
        // FORMAT BASED ON FORM TYPE
        const pdfOptions =
          entry.formType === "Liquidation"
            ? { format: "a4", orientation: "portrait" } // Liquidation PDF
            : { format: "a5", orientation: "landscape" }; // Cash Request / Cash Voucher

        const filename =
          entry.formType === "Liquidation"
            ? `liquidation-${entry.id}.pdf`
            : `cash-request-${entry.cv_number || entry.id}.pdf`;

        await downloadPDF(downloadRef, filename, pdfOptions);
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
