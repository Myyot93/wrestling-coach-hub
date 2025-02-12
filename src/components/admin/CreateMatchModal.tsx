
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type CreateMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teams: Array<{ id: number; name: string }>;
  seasons: Array<{ id: number; name: string }>;
};

const CreateMatchModal = ({ isOpen, onClose, teams, seasons }: CreateMatchModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [venue, setVenue] = useState("");
  const [seasonId, setSeasonId] = useState<string>("");
  const [weightClass, setWeightClass] = useState("");

  const createMatch = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('matches')
        .insert([{
          home_team_id: parseInt(homeTeamId),
          away_team_id: parseInt(awayTeamId),
          match_date: matchDate,
          match_time: matchTime,
          venue,
          season_id: parseInt(seasonId),
          weight_class: weightClass,
          status: 'scheduled'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
      toast({
        title: "Match created",
        description: "The match has been successfully created.",
      });
      onClose();
      // Reset form
      setHomeTeamId("");
      setAwayTeamId("");
      setMatchDate("");
      setMatchTime("");
      setVenue("");
      setSeasonId("");
      setWeightClass("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating match",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Match</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Home Team</label>
              <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Away Team</label>
              <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Venue</label>
            <Input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Enter venue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Season</label>
            <Select value={seasonId} onValueChange={setSeasonId}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.id} value={season.id.toString()}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight Class</label>
            <Input
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value)}
              placeholder="Enter weight class"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => createMatch.mutate()}
              disabled={!homeTeamId || !awayTeamId || !matchDate || !seasonId}
            >
              Create Match
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMatchModal;
