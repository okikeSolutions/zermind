import { MousePointer2 } from "lucide-react";
import { CollaborativeUser } from "@/hooks/use-realtime-collaboration";
import { cn } from "@/lib/utils";
import { sx } from "@/styles/sx";

interface RealtimeCursorsProps {
  users: CollaborativeUser[];
  className?: string;
}

export function RealtimeCursors({ users, className }: RealtimeCursorsProps) {
  return (
    <div {...sx(cn("pointer-events-none fixed inset-0 z-50", className))}>
      {users.map((user) => {
        if (!user.cursor) return null;

        return (
          <div
            key={user.id}
            {...sx("absolute transition-all duration-100 ease-out")}
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
              transform: "translate(-2px, -2px)",
            }}
          >
            {/* Cursor pointer */}
            <MousePointer2
              size={24}
              color={user.color}
              fill={user.color}
              {...sx("drop-shadow-md")}
            />

            {/* User name label */}
            <div
              {...sx(
                "ml-4 mt-1 px-2 py-1 rounded text-xs font-medium text-white text-center whitespace-nowrap max-w-[120px] truncate shadow-md",
              )}
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Component for showing user avatars in a presence indicator
export function CollaborationPresence({ users }: { users: CollaborativeUser[] }) {
  if (users.length === 0) return null;

  return (
    <div
      {...sx(
        "flex items-center space-x-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm",
      )}
    >
      <div {...sx("flex -space-x-2")}>
        {users.slice(0, 3).map((user) => (
          <div
            key={user.id}
            {...sx(
              "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white",
            )}
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 3 && (
          <div
            {...sx(
              "w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium",
            )}
          >
            +{users.length - 3}
          </div>
        )}
      </div>
      <div {...sx("text-sm text-muted-foreground")}>
        {users.length === 1
          ? `${users[0].name} is collaborating`
          : `${users.length} people collaborating`}
      </div>
    </div>
  );
}
