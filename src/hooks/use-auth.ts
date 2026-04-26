"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  user_metadata: {
    name?: string | null;
    full_name?: string | null;
  };
};

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const authUser = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

  const user: AuthUser | null = authUser
    ? {
        id: authUser.userId ?? authUser._id,
        email: authUser.email,
        name: authUser.name,
        image: authUser.image,
        user_metadata: {
          name: authUser.name,
          full_name: authUser.name,
        },
      }
    : null;

  return {
    data: {
      user,
      isAuthenticated,
    },
    isLoading: isLoading || (isAuthenticated && authUser === undefined),
    error: null,
  };
}

export function useAuthUser() {
  const { data, isLoading, error } = useAuth();

  return {
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    isLoading,
    error,
  };
}
