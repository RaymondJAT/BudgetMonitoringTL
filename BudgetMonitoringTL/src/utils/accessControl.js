export const getAccessList = () => {
  try {
    const stored = localStorage.getItem("access");
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed && Array.isArray(parsed.data)) {
      return parsed.data;
    }

    return [];
  } catch (err) {
    console.error("Error parsing access list:", err);
    return [];
  }
};

export const hasAccess = (path) => {
  const accessList = getAccessList();

  const normalizedPath = path.replace(/^\//, "");

  if (!Array.isArray(accessList)) {
    console.warn("Access list is not valid:", accessList);
    return false;
  }

  const allowed = accessList.find(
    (item) =>
      item.name === normalizedPath &&
      (item.status === "active" || item.status === "Full Access")
  );

  return Boolean(allowed);
};
