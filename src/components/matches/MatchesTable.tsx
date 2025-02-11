
import { useState } from "react";
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
import MatchStatusBadge from "./MatchStatusBadge";
import { supabase } from "@/integrations/supabase/client";

type Match = {
  id: number;
  match_date: string;
  home_team: { name: string };
  away_team: { name: string };
  venue: string | null;
  status: string;
  winner: { name: string } | null;
  notes: string | null;
  home_team_id: number;
  away_team_id: number;
};

type MatchesTableProps = {
  matches: Match[];
  userTeamId: number | null;
  userRole: string;
};

const MatchesTable = ({ matches, userTeamId, userRole }: MatchesTableProps) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<Record<number, string>>({});

  const handleScoreSubmit = async (match: Match) => {
    if (!userTeamId || !scores[match.id]) return;

    const score = parseInt(scores[match.id]);
    if (isNaN(score)) {
      toast({
        variant: "destructive",
        title: "Invalid score",
        description: "Please enter a valid number",
      });
      return;
    }

    const { error } = await supabase
      .from('scores')
      .insert({
        match_id: match.id,
        team_id: userTeamId,
        score: score
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error submitting score",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Score submitted successfully",
      description: "Your team's score has been recorded",
    });
    
    // Clear the input
    setScores(prev => ({
      ...prev,
      [match.id]: ''
    }));
  };

  return (
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
          {userRole === 'coach' && <TableHead>Score</TableHead>}
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
              <MatchStatusBadge status={match.status} />
            </TableCell>
            <TableCell>{match.winner?.name || 'TBD'}</TableCell>
            <TableCell>
              {match.notes && (
                <span className="text-sm text-gray-600">{match.notes}</span>
              )}
            </TableCell>
            {userRole === 'coach' && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={scores[match.id] || ''}
                    onChange={(e) => setScores(prev => ({
                      ...prev,
                      [match.id]: e.target.value
                    }))}
                    placeholder="Enter score"
                    className="w-24"
                  />
                  <Button 
                    onClick={() => handleScoreSubmit(match)}
                    disabled={!scores[match.id] || match.status !== 'in_progress'}
                  >
                    Submit
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MatchesTable;
