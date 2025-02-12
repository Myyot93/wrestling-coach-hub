
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const AuditLog = () => {
  const { data: auditLogs } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          user:profiles(
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-wrestling-light">Audit Log</h2>
      </div>

      <Table>
        <TableCaption>System audit log</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Record ID</TableHead>
            <TableHead>Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}</TableCell>
              <TableCell>{log.user?.full_name || 'System'}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.table_name}</TableCell>
              <TableCell>{log.record_id}</TableCell>
              <TableCell>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLog;
