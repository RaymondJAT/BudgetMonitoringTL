export const normalizeBase64Image = (signature) => {
  if (!signature) return null;

  let clean = signature.trim();

  const parts = clean.split("data:image/png;base64,");
  if (parts.length > 2) {
    clean = `data:image/png;base64,${parts.pop()}`;
  }

  try {
    const decoded = atob(clean.replace(/^data:image\/png;base64,/, ""));
    if (decoded.startsWith("data:image")) {
      clean = decoded;
    }
  } catch (e) {}

  clean = clean.replace(/base64:[^,]+:/, "");

  if (clean.startsWith("data:image") && clean.includes("base64,")) {
    return clean;
  }

  return `data:image/png;base64,${clean}`;
};
