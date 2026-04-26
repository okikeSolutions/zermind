"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Shield,
  Database,
  Cookie,
  Eye,
  Users,
  Lock,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";
import InfoSection from "@/components/info-section";

export default function PrivacyPolicy() {
  return (
    <main className="flex-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl mt-6">
        <Button
          asChild
          variant="ghost"
          className="mb-8 text-primary hover:text-primary/80 transition-colors"
        >
          <Link href="/">
            <span className="mr-2" aria-hidden="true">
              &larr;
            </span>{" "}
            Back to home
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-lg border-none">
          <CardHeader className="bg-primary text-neutral-50">
            <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div className="mb-8 text-sm text-muted-foreground">
              <p>Last updated: April 2026</p>
            </div>

            <div className="prose prose-neutral max-w-none mb-8">
              <p className="text-lg text-muted-foreground">
                At Zermind, we take your privacy seriously. This Privacy Policy explains how we
                collect, use, and protect your information when you use our AI chat application.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              <InfoSection
                icon={Database}
                title="Data We Collect"
                content={[
                  "Account information (email address, username)",
                  "Chat messages, conversation history, and mind-map metadata",
                  "Uploaded file attachments and related metadata",
                  "Model preferences, BYOK provider settings, and encrypted API-key references",
                  "Usage analytics and error logs",
                  "Device and browser information",
                ]}
              />

              <InfoSection
                icon={Eye}
                title="How We Use Your Data"
                content={[
                  "Provide and improve the chat service",
                  "Sync your conversations across devices",
                  "Authenticate and secure your account",
                  "Analyze usage patterns to enhance the app",
                  "Communicate important service updates",
                ]}
              />

              <InfoSection
                icon={MessageSquare}
                title="Chat Data Processing"
                content={[
                  "Messages and supported attachments are sent to your selected AI provider",
                  "Conversations are stored in Convex Agent threads with mind-map metadata in Convex",
                  "Uploaded attachments are stored in Convex file storage and referenced by storage IDs",
                  "Shared chats may be publicly accessible via share links",
                  "You can delete individual chats or your entire history",
                  "We do not train AI models on your conversations",
                ]}
              />

              <InfoSection
                icon={Shield}
                title="Data Protection"
                content={[
                  "All data is encrypted in transit and at rest by our infrastructure providers",
                  "We use Convex Better Auth for secure authentication",
                  "User-provided API keys are encrypted before storage and are never returned to clients",
                  "Access controls and monitoring are in place",
                  "Regular security updates and privacy reviews",
                ]}
              />

              <InfoSection
                icon={Users}
                title="Third-Party Services"
                content={[
                  "Convex (authentication integration, database, file storage, and realtime backend)",
                  "Better Auth (account authentication flows)",
                  "Vercel (hosting and deployment)",
                  "AI providers selected by you, including OpenAI, Anthropic, Google, and OpenRouter-compatible models",
                  "Analytics services, where enabled, using limited or anonymized usage data",
                ]}
              />

              <InfoSection
                icon={Cookie}
                title="Cookies & Storage"
                content={[
                  "Essential cookies for authentication",
                  "Local storage for app preferences",
                  "Session tokens for secure access",
                  "No tracking cookies or ads",
                  "You can clear browser data anytime",
                ]}
              />

              <InfoSection
                icon={Globe}
                title="Data Sharing"
                content={[
                  "We never sell your personal data",
                  "Shared chats are public by design",
                  "AI providers process your messages for responses",
                  "We may share anonymized analytics",
                  "Legal compliance when required by law",
                ]}
              />

              <InfoSection
                icon={Lock}
                title="Your Rights"
                content={[
                  "Access and download your data",
                  "Delete your account and all data",
                  "Modify your personal information",
                  "Opt out of analytics collection",
                  "Request data portability",
                ]}
              />

              <InfoSection
                icon={AlertCircle}
                title="Data Retention"
                content={[
                  "Account data: Until account deletion",
                  "Chat history and Agent threads: Until manually deleted or account deletion",
                  "Uploaded files: Until the related chat, file, or account is deleted",
                  "Shared chats: Until share link is revoked or the chat is deleted",
                  "Analytics and security logs: Retained only as needed for service operation and abuse prevention",
                ]}
              />
            </div>

            <div className="mt-8 border-t pt-6 text-sm text-muted-foreground space-y-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">Open Source Transparency</h4>
                <p>
                  Zermind is open source under the MIT license. You can review our code, security
                  practices, and data handling on{" "}
                  <a
                    href="https://github.com/okikeSolutions/zermind"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Contact Us</h4>
                <p>
                  For privacy questions or data requests, contact us at{" "}
                  <a
                    href="mailto:info@okike-solutions.com"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    info@okike-solutions.com
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Changes to This Policy</h4>
                <p>
                  We may update this Privacy Policy periodically. Significant changes will be
                  communicated via email or app notification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
