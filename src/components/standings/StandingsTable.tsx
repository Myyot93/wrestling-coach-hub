
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Standing = {
  standing_id: number;
  team: { name: string };
  wins: number;
  losses: number;
  draws: number;
  points: number;
};

type StandingsTableProps = {
  standings: Standing[];
};

const StandingsTable = ({ standings }: StandingsTableProps) => {
  return (
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
  );
};

export default StandingsTable;
