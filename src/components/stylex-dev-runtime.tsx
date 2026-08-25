import { useEffect } from "react";

export function StyleXDevRuntime() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("virtual:stylex:runtime");
    }
  }, []);

  return import.meta.env.DEV ? <link rel="stylesheet" href="/virtual:stylex.css" /> : null;
}
