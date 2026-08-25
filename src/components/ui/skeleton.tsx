import { cn } from "@/lib/utils";
import { sx } from "@/styles/sx";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      {...sx(cn("bg-accent animate-pulse rounded-md", className))}
      {...props}
    />
  );
}

export { Skeleton };
