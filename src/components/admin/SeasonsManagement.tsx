
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
import { format } from "date-fns";

const SeasonsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSeasonName, setNewSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const addSeason = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('seasons')
        .insert([{
          name: newSeasonName,
          start_date: startDate,
          end_date: endDate,
          is_active: false
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      setNewSeasonName("");
      setStartDate("");
      setEndDate("");
      toast({
        title: "Season added",
        description: "The season has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error adding season",
        description: error.message,
      });
    },
  });

  const toggleSeasonStatus = useMutation({
    mutationFn: async ({ seasonId, isActive }: { seasonId: number, isActive: boolean }) => {
      // First, deactivate all seasons if we're activating one
      if (isActive) {
        await supabase
          .from('seasons')
          .update({ is_active: false })
          .neq('id', seasonId);
      }

      // Then update the target season
      const { error } = await supabase
        .from('seasons')
        .update({ is_active: isActive })
        .eq('id', seasonId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      toast({
        title: "Season status updated",
        description: "The season status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating season status",
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wrestling-light">Manage Seasons</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Season Name"
          value={newSeasonName}
          onChange={(e) => setNewSeasonName(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button 
          onClick={() => addSeason.mutate()}
          disabled={!newSeasonName || !startDate || !endDate}
        >
          Add Season
        </Button>
      </div>

      <Table>
        <TableCaption>All seasons</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Season Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons?.map((season) => (
            <TableRow key={season.id}>
              <TableCell>{season.name}</TableCell>
              <TableCell>{format(new Date(season.start_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(season.end_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{season.is_active ? 'Active' : 'Inactive'}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant={season.is_active ? "destructive" : "outline"} 
                  size="sm"
                  onClick={() => toggleSeasonStatus.mutate({
                    seasonId: season.id,
                    isActive: !season.is_active
                  })}
                >
                  {season.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SeasonsManagement;
