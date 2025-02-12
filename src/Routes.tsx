
import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MatchesManagement from "./components/admin/MatchesManagement";
import TeamsManagement from "./components/admin/TeamsManagement";
import UsersManagement from "./components/admin/UsersManagement";
import SeasonsManagement from "./components/admin/SeasonsManagement";
import ReportsManagement from "./components/admin/ReportsManagement";
import AuditLog from "./components/admin/AuditLog";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<MatchesManagement />} />
        <Route path="matches" element={<MatchesManagement />} />
        <Route path="teams" element={<TeamsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="seasons" element={<SeasonsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
