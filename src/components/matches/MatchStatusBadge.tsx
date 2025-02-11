
import { Badge } from "@/components/ui/badge";

type MatchStatusBadgeProps = {
  status: string;
};

const MatchStatusBadge = ({ status }: MatchStatusBadgeProps) => {
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
    <Badge className={getStatusColor(status)}>
      {status?.replace('_', ' ')}
    </Badge>
  );
};

export default MatchStatusBadge;
