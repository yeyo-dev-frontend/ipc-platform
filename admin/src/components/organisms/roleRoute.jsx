import { Navigate } from "react-router-dom";

export function RoleRoute({ role, allowed, children }) {
  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
