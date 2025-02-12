
import { Outlet } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNav from "@/components/admin/AdminNav";

const Admin = () => {
  return (
    <AdminLayout>
      <AdminNav />
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
