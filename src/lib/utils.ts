import { clsx, type ClassValue } from "clsx";

import * as m from "@/paraglide/messages.js";
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [m.copy_bytes(), m.copy_kb(), m.copy_mb(), m.copy_gb(), m.copy_tb()];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
