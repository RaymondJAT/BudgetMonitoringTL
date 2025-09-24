import downloadPDF from "../utils/downloadAsPdf";
import { FaFileDownload } from "react-icons/fa";

export const meatballActions = ({
  downloadRef,
  setPrintData,
  isReleasedPage = false,
}) => {
  const actions = [
    {
      label: "Download",
      Icon: FaFileDownload,
      iconProps: { className: "me-2" },
      onClick: async (entry) => {
        setPrintData(entry);

        setTimeout(async () => {
          let pdfOptions;
          let filename;

          if (entry.formType === "Liquidation") {
            pdfOptions = { format: "a4", orientation: "portrait" };
            filename = `liquidation-${entry.id}.pdf`;
          } else if (entry.formType === "Cash Voucher") {
            pdfOptions = { format: "a5", orientation: "landscape" };
            filename = `cash-voucher-${entry.cv_number || entry.id}.pdf`;
          } else {
            // Default: Cash Request
            pdfOptions = { format: "a5", orientation: "landscape" };
            filename = `cash-request-${entry.cv_number || entry.id}.pdf`;
          }

          await downloadPDF(downloadRef, filename, pdfOptions);
        }, 200);
      },
    },
  ];

  if (isReleasedPage) {
    actions.push({
      label: "Download CV",
      Icon: FaFileDownload,
      iconProps: { className: "me-2" },
      onClick: async (entry) => {
        setPrintData({ ...entry, formType: "Cash Voucher" });

        setTimeout(async () => {
          const pdfOptions = { format: "a5", orientation: "landscape" };
          const filename = `cash-voucher-${entry.cv_number || entry.id}.pdf`;

          await downloadPDF(downloadRef, filename, pdfOptions);
        }, 200);
      },
    });
  }

  return actions;
};

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
