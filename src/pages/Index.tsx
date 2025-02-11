
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MatchesTable from "@/components/matches/MatchesTable";
import StandingsTable from "@/components/standings/StandingsTable";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch profile data including team_id and role
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  // Fetch team's matches
  const { data: matches } = useQuery({
    queryKey: ["matches", profile?.team_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name),
          winner:teams!matches_winner_team_id_fkey(name)
        `)
        .or(`home_team_id.eq.${profile?.team_id},away_team_id.eq.${profile?.team_id}`)
        .order('match_date', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching matches",
          description: error.message,
        });
        return [];
      }
      return data;
    },
    enabled: !!profile?.team_id,
  });

  // Fetch standings
  const { data: standings } = useQuery({
    queryKey: ["standings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("standings")
        .select(`
          *,
          team:teams(name)
        `)
        .order('points', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching standings",
          description: error.message,
        });
        return [];
      }
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-wrestling-dark">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-wrestling-light mb-4">
            Welcome, {profile?.full_name || 'Coach'}
          </h1>
          <p className="text-wrestling-muted">
            Manage your team's matches and view standings
          </p>
        </motion.div>

        {/* Team Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Team's Matches</h2>
          <MatchesTable 
            matches={matches || []} 
            userTeamId={profile?.team_id} 
            userRole={profile?.role || 'user'}
          />
        </motion.div>

        {/* League Standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">League Standings</h2>
          <StandingsTable standings={standings || []} />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
