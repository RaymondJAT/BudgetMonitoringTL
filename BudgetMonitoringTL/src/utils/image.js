export const normalizeBase64Image = (input) => {
  if (!input) return null;

  let clean = input.trim();

  // Remove prefixes like "base64:xxx:" or "type251:"
  clean = clean.replace(/^(base64:[^:]+:|type\d+:)/gi, "");

  try {
    // Try to parse as JSON first (your receipts format)
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed[0]?.image) {
      return parsed[0].image; // take first receipt image
    }
  } catch {
    // Not JSON → continue
  }

  // If already a valid data URI
  if (clean.startsWith("data:image") && clean.includes("base64,")) {
    return clean;
  }

  // Fallback: ensure proper data URI with default PNG
  return `data:image/png;base64,${clean.replace(/^data:[^,]+,/, "")}`;
};
