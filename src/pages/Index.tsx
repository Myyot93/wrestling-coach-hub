
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

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
          <Table>
            <TableCaption>A list of your team's matches</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches?.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    {new Date(match.match_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{match.home_team?.name}</TableCell>
                  <TableCell>{match.away_team?.name}</TableCell>
                  <TableCell>{match.venue || 'TBD'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(match.status)}>
                      {match.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{match.winner?.name || 'TBD'}</TableCell>
                  <TableCell>
                    {match.notes && (
                      <span className="text-sm text-gray-600">{match.notes}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* League Standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">League Standings</h2>
          <Table>
            <TableCaption>Current league standings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Losses</TableHead>
                <TableHead>Draws</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings?.map((standing) => (
                <TableRow key={standing.standing_id}>
                  <TableCell>{standing.team?.name}</TableCell>
                  <TableCell>{standing.wins}</TableCell>
                  <TableCell>{standing.losses}</TableCell>
                  <TableCell>{standing.draws}</TableCell>
                  <TableCell>{standing.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
