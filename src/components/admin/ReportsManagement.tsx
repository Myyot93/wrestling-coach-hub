
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsManagement = () => {
  const { data: matchStats } = useQuery({
    queryKey: ["match-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          status,
          count
        `)
        .select('*');

      if (error) throw error;

      // Process data for chart
      const stats = data.reduce((acc: any, match) => {
        acc[match.status] = (acc[match.status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([status, count]) => ({
        status,
        count
      }));
    },
  });

  const { data: teamStats } = useQuery({
    queryKey: ["team-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("standings")
        .select(`
          team:teams(name),
          wins,
          losses,
          draws
        `)
        .order('wins', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wrestling-light">Reports & Analytics</h2>
        <Button variant="outline">Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Match Status Distribution</CardTitle>
            <CardDescription>Overview of all matches by their current status</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Teams</CardTitle>
            <CardDescription>Teams with the most wins this season</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamStats?.map(stat => ({
                name: stat.team.name,
                wins: stat.wins,
                losses: stat.losses,
                draws: stat.draws
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#82ca9d" />
                <Bar dataKey="losses" fill="#ff8042" />
                <Bar dataKey="draws" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagement;
