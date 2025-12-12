import prisma from "@/lib/prisma";
import {
  FeedbackSchema,
  type Feedback,
  type CreateFeedback,
} from "@/lib/schemas/feedback";
import { z } from "zod";

// Define Zod schema for valid feedback status values
const FeedbackStatusSchema = z.enum([
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

// Create new feedback
export async function createFeedback(
  userId: string,
  data: CreateFeedback,
  userAgent?: string
): Promise<Feedback> {
  const rawFeedback = await prisma.feedback.create({
    data: {
      userId,
      message: data.message,
      type: data.type || "general",
      userAgent: userAgent || null,
    },
  });

  // Validate and transform the data using Zod
  return FeedbackSchema.parse(rawFeedback);
}

// Get user's feedback (optional - for user dashboard)
export async function getUserFeedback(userId: string): Promise<Feedback[]> {
  const rawFeedback = await prisma.feedback.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Validate and transform the data using Zod
  return rawFeedback.map((feedback) => FeedbackSchema.parse(feedback));
}

// Get all feedback (admin only - optional)
export async function getAllFeedback(
  limit: number = 50,
  offset: number = 0
): Promise<Feedback[]> {
  const rawFeedback = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  // Validate and transform the data using Zod
  return rawFeedback.map((feedback) => FeedbackSchema.parse(feedback));
}

// Update feedback status (admin only - optional)
export async function updateFeedbackStatus(
  feedbackId: string,
  status: "open" | "in_progress" | "resolved" | "closed"
): Promise<Feedback> {
  // Validate status parameter before database update
  try {
    FeedbackStatusSchema.parse(status);
  } catch {
    throw new Error(
      `Invalid feedback status: ${status}. Must be one of: open, in_progress, resolved, closed`
    );
  }

  const rawFeedback = await prisma.feedback.update({
    where: {
      id: feedbackId,
    },
    data: {
      status,
    },
  });

  // Validate and transform the data using Zod
  return FeedbackSchema.parse(rawFeedback);
}

// Get feedback count by type (analytics - optional)
export async function getFeedbackStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}> {
  const [total, byType, byStatus] = await Promise.all([
    prisma.feedback.count(),
    prisma.feedback.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    }),
    prisma.feedback.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
  ]);

  return {
    total,
    byType: byType.reduce((acc, item) => {
      acc[item.type] = item._count.id;
      return acc;
    }, {} as Record<string, number>),
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>),
  };
}
