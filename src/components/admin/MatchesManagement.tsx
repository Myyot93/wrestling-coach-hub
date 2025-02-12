
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import MatchStatusBadge from "../matches/MatchStatusBadge";
import CreateMatchModal from "./CreateMatchModal";

type MatchStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

const MatchesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch matches with related data
  const { data: matches } = useQuery({
    queryKey: ["admin-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name),
          winner:teams!matches_winner_team_id_fkey(name),
          season:seasons(name)
        `)
        .order('match_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch teams for dropdowns
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch seasons for the create form
  const { data: seasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Update match status mutation
  const updateMatchStatus = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: number, status: MatchStatus }) => {
      const { error } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
      toast({
        title: "Match status updated",
        description: "The match status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating match status",
        description: error.message,
      });
    },
  });

  const handleStatusChange = (matchId: number, status: MatchStatus) => {
    updateMatchStatus.mutate({ matchId, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wrestling-light">Manage Matches</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add New Match</Button>
      </div>

      <Table>
        <TableCaption>All scheduled matches</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Home Team</TableHead>
            <TableHead>Away Team</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Weight Class</TableHead>
            <TableHead>Season</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches?.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{new Date(match.match_date).toLocaleDateString()}</TableCell>
              <TableCell>{match.match_time || 'TBD'}</TableCell>
              <TableCell>{match.home_team?.name}</TableCell>
              <TableCell>{match.away_team?.name}</TableCell>
              <TableCell>{match.venue || 'TBD'}</TableCell>
              <TableCell>{match.weight_class || 'N/A'}</TableCell>
              <TableCell>{match.season?.name || 'N/A'}</TableCell>
              <TableCell>
                <Select
                  value={match.status}
                  onValueChange={(value) => handleStatusChange(match.id, value as MatchStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      <MatchStatusBadge status={match.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMatch(match.id)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {teams && seasons && (
        <CreateMatchModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          teams={teams}
          seasons={seasons}
        />
      )}
    </div>
  );
};

export default MatchesManagement;
