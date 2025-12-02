import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    ACTIVE: {
      label: "Active",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    CLOSED: {
      label: "Closed",
      className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    ACCEPTED: {
      label: "Accepted",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    SUCCESS: {
      label: "Success",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}



