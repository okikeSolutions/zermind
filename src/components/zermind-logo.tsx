import Link from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { sx } from "@/styles/sx";

interface ZermindLogoProps {
  variant?: "default" | "compact";
  className?: string;
}

export function ZermindLogo({ variant = "default", className = "" }: ZermindLogoProps) {
  if (variant === "compact") {
    return (
      <Button
        render={<Link href="/" {...sx("flex items-center space-x-2")} />}
        nativeButton={false}
        variant="ghost"
        size="sm"
        className={`hover:bg-transparent ${className}`}
      >
        <span {...sx("font-bold text-lg bg-primary bg-clip-text text-transparent")}>Zermind</span>
      </Button>
    );
  }

  return (
    <Button
      render={<Link href="/" {...sx("flex items-center space-x-2")} />}
      nativeButton={false}
      variant="ghost"
      className={`hover:bg-transparent ${className}`}
    >
      <span {...sx("font-bold text-2xl bg-primary bg-clip-text text-transparent")}>Zermind</span>
    </Button>
  );
}
