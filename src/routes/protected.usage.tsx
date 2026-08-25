import { createFileRoute } from "@tanstack/react-router";
import UsagePage from "@/pages/protected/usage";

export const Route = createFileRoute("/protected/usage")({ component: UsagePage });
