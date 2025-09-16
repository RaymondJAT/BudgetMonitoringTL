import { navConfig } from "../handlers/navLinks";

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

// COLLECT DEFINED ROUTES
export const getAllDefinedRoutes = () => {
  return navConfig
    .flatMap((item) =>
      item.children
        ? item.children.map((child) => child.path.replace(/^\//, ""))
        : item.path
        ? [item.path.replace(/^\//, "")]
        : []
    )
    .filter(Boolean);
};

export const hasAccess = (path) => {
  const accessList = getAccessList();
  const normalizedPath = path.replace(/^\//, "");
  const allDefinedRoutes = getAllDefinedRoutes();

  // DENY IF PATH DOESN'T EXIST
  if (!allDefinedRoutes.includes(normalizedPath)) return false;

  // FALLBACK
  if (!Array.isArray(accessList) || accessList.length === 0) return true;

  // CHECK IF ACCESS IS GRANTED
  const allowed = accessList.find(
    (item) =>
      item.name === normalizedPath &&
      (item.status === "active" || item.status === "Full Access")
  );

  return allowed ? true : true;
};
