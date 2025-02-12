
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";

const AdminNav = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'matches';

  return (
    <div className="mb-8">
      <Tabs value={currentPath} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="matches" asChild>
            <Link to="/admin/matches">Matches</Link>
          </TabsTrigger>
          <TabsTrigger value="teams" asChild>
            <Link to="/admin/teams">Teams</Link>
          </TabsTrigger>
          <TabsTrigger value="users" asChild>
            <Link to="/admin/users">Users</Link>
          </TabsTrigger>
          <TabsTrigger value="seasons" asChild>
            <Link to="/admin/seasons">Seasons</Link>
          </TabsTrigger>
          <TabsTrigger value="reports" asChild>
            <Link to="/admin/reports">Reports</Link>
          </TabsTrigger>
          <TabsTrigger value="audit" asChild>
            <Link to="/admin/audit">Audit Log</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNav;
