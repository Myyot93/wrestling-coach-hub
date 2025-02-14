
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
import { Search, ArrowUpDown } from "lucide-react";
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

const MatchesTable = ({ matches: initialMatches, userTeamId, userRole }: MatchesTableProps) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Match | 'home_team.name' | 'away_team.name';
    direction: 'asc' | 'desc';
  } | null>(null);
  const [matches, setMatches] = useState(initialMatches);

  const handleSort = (key: typeof sortConfig.key) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedMatches = [...matches].sort((a, b) => {
      let aValue = key.includes('.') ? key.split('.').reduce((obj, i) => obj[i], a) : a[key];
      let bValue = key.includes('.') ? key.split('.').reduce((obj, i) => obj[i], b) : b[key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return direction === 'asc' ? (aValue > bValue ? 1 : -1) : (bValue > aValue ? 1 : -1);
    });

    setMatches(sortedMatches);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filteredMatches = initialMatches.filter(match => 
      match.home_team.name.toLowerCase().includes(term.toLowerCase()) ||
      match.away_team.name.toLowerCase().includes(term.toLowerCase()) ||
      match.venue?.toLowerCase().includes(term.toLowerCase())
    );
    setMatches(filteredMatches);
  };

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
    
    setScores(prev => ({
      ...prev,
      [match.id]: ''
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableCaption>A list of your team's matches</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('match_date')} className="cursor-pointer">
                Date <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('home_team.name')} className="cursor-pointer">
                Home Team <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('away_team.name')} className="cursor-pointer">
                Away Team <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('venue')} className="cursor-pointer">
                Venue <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Notes</TableHead>
              {userRole === 'coach' && <TableHead>Score</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
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
      </div>
    </div>
  );
};

export default MatchesTable;
