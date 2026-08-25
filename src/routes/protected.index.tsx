import { createFileRoute } from "@tanstack/react-router";
import ProtectedPage from "@/pages/protected";

export const Route = createFileRoute("/protected/")({ component: ProtectedPage });
