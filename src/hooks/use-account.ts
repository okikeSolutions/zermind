"use client";

import { useCallback, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";
import { DeleteAccount, DeleteAccountResponse } from "@/lib/schemas/account";

export const accountKeys = {
  all: ["account"] as const,
  stats: () => [...accountKeys.all, "stats"] as const,
};

type MutationFn<Args, Result> = (args: Args) => Promise<Result>;

function useMutationCompat<Args, Result>(mutationFn: MutationFn<Args, Result>) {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (args: Args) => {
      setIsPending(true);
      try {
        return await mutationFn(args);
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn],
  );

  const mutate = useCallback(
    (args: Args) => {
      void mutateAsync(args);
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending };
}

export function useAccountStats() {
  const stats = useQuery(api.account.stats, {});

  return {
    data: stats,
    isLoading: stats === undefined,
    error: null as Error | null,
  };
}

export function useExportData() {
  const exportData = useQuery(api.account.exportMine, {});
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (): Promise<void> => {
    setIsPending(true);
    try {
      if (!exportData) {
        throw new Error("Data export is still loading. Please try again in a moment.");
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `zermind-data-export-${timestamp}.json`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      setIsPending(false);
    }
  }, [exportData]);

  return {
    mutate: () => {
      void mutateAsync();
    },
    mutateAsync,
    isPending,
  };
}

export function useDeleteAccount() {
  const deleteMyData = useMutation(api.account.deleteMyData);

  return useMutationCompat(async (data: DeleteAccount): Promise<DeleteAccountResponse> => {
    const result = await deleteMyData({ confirmation: data.confirmation });
    await authClient.signOut();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    return result;
  });
}
