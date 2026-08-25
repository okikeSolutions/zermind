import * as React from "react";

import { cn } from "@/lib/utils";
import { sx } from "@/styles/sx";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // The association is supplied by consumers through htmlFor or nested controls.
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      data-slot="label"
      {...sx(
        cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className,
        ),
      )}
      {...props}
    />
  );
}

export { Label };
