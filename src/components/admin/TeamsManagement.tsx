
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const TeamsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTeamName, setNewTeamName] = useState("");
  const [newCoachName, setNewCoachName] = useState("");

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

  const addTeam = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('teams')
        .insert([{ name: newTeamName, coach: newCoachName }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setNewTeamName("");
      setNewCoachName("");
      toast({
        title: "Team added",
        description: "The team has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error adding team",
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wrestling-light">Manage Teams</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <Input
          placeholder="Coach Name"
          value={newCoachName}
          onChange={(e) => setNewCoachName(e.target.value)}
        />
        <Button 
          onClick={() => addTeam.mutate()}
          disabled={!newTeamName || !newCoachName}
        >
          Add Team
        </Button>
      </div>

      <Table>
        <TableCaption>All teams in the league</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.coach}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamsManagement;
