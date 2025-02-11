
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // Verify admin role
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-wrestling-dark">
      <Navbar />
      <div className="container mx-auto pt-32 pb-20 px-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
