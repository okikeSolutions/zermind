import { useCallback, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  type PublicApiKey,
  type CreateApiKey,
  type UpdateApiKey,
  type Provider,
} from "@/lib/schemas/api-keys";

export const apiKeysKeys = {
  all: ["api-keys"] as const,
  lists: () => [...apiKeysKeys.all, "list"] as const,
  list: () => [...apiKeysKeys.lists()] as const,
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

function toPublicApiKey(key: {
  _id: Id<"apiKeys">;
  provider: Provider;
  keyName: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
  keyPreview: string;
}): PublicApiKey {
  return {
    id: key._id,
    provider: key.provider,
    keyName: key.keyName,
    isActive: key.isActive,
    createdAt: new Date(key.createdAt),
    updatedAt: new Date(key.updatedAt),
    lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
    keyPreview: key.keyPreview,
  };
}

export function useApiKeys() {
  const apiKeys = useQuery(api.apiKeys.listMine, {});

  return {
    data: useMemo(() => apiKeys?.map((key) => toPublicApiKey(key)) ?? [], [apiKeys]),
    isLoading: apiKeys === undefined,
    error: null as Error | null,
  };
}

export function useCreateApiKey() {
  const createApiKey = useAction(api.apiKeyActions.create);

  return useMutationCompat(async (data: CreateApiKey): Promise<PublicApiKey> => {
    const key = await createApiKey(data);
    return toPublicApiKey(key);
  });
}

export function useUpdateApiKey() {
  const updateApiKey = useMutation(api.apiKeys.update);

  return useMutationCompat(
    async ({ keyId, data }: { keyId: string; data: UpdateApiKey }): Promise<PublicApiKey> => {
      const key = await updateApiKey({
        keyId: keyId as Id<"apiKeys">,
        keyName: data.keyName,
        isActive: data.isActive,
      });
      return toPublicApiKey(key);
    },
  );
}

export function useDeleteApiKey() {
  const deleteApiKey = useMutation(api.apiKeys.remove);

  return useMutationCompat(async (keyId: string): Promise<void> => {
    await deleteApiKey({ keyId: keyId as Id<"apiKeys"> });
  });
}

export function useHasApiKey(provider: Provider) {
  const { data: apiKeys = [] } = useApiKeys();
  return apiKeys.some((key) => key.provider === provider && key.isActive);
}
