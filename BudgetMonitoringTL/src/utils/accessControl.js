import { navConfig } from "../handlers/navLinks";
import { routeConfig } from "../routes/Routing";

const normalize = (path) => path.replace(/^\//, "").toLowerCase();

// Aliases (mismatched names between modules)
const routeAliases = {
  rejected_liquidations: "reject_liquidations", // Finance vs TL mismatch
};

// Parent map (internal → parent route)
const routeParentMap = {
  view_cash_request: "employee_request",
  view_liquidation_form: "employee_request",
  cash_approval_form: "teamlead_pendings",
  liquid_approval_form: "teamlead_pendings",
  finance_liquid_form: "finance_dashboard",
  finance_approval_form: "finance_dashboard",
};

export const getAccessList = () => {
  try {
    const stored = localStorage.getItem("access");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch (err) {
    console.error("Error parsing access list:", err);
    return [];
  }
};

// Collect all possible defined routes
export const getAllDefinedRoutes = () => {
  const fromNav = navConfig.flatMap((item) =>
    item.children
      ? item.children.map((child) => normalize(child.path))
      : item.path
      ? [normalize(item.path)]
      : []
  );
  const fromRoute = routeConfig.map((r) => normalize(r.path));
  return [...new Set([...fromNav, ...fromRoute])];
};

export const hasAccess = (path) => {
  const accessList = getAccessList();
  let normalizedPath = normalize(path);
  const allDefinedRoutes = getAllDefinedRoutes();

  // Apply alias
  if (routeAliases[normalizedPath]) {
    normalizedPath = routeAliases[normalizedPath];
  }

  // Apply parent mapping
  if (routeParentMap[normalizedPath]) {
    normalizedPath = routeParentMap[normalizedPath];
  }

  // Route not defined in app
  if (!allDefinedRoutes.includes(normalizedPath)) return false;

  // Empty access list = full access
  if (!Array.isArray(accessList) || accessList.length === 0) return true;

  // Check access list (normalize both name and path)
  const allowed = accessList.find((item) => {
    const name = item.name ? normalize(item.name) : null; // 🔥 normalize here
    const itemPath = item.path ? normalize(item.path) : null;
    const status = item.status?.toLowerCase();

    if (status !== "active" && status !== "full access") return false;

    return (
      normalizedPath === name ||
      normalizedPath === itemPath ||
      normalizedPath.startsWith(name) ||
      (itemPath && normalizedPath.startsWith(itemPath))
    );
  });

  return !!allowed;
};
