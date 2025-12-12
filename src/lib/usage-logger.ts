import prisma from '@/lib/prisma';
import { type UsageStats } from '@/lib/schemas/usage';

export async function logModelUsage(model: string, userId: string, chatId?: string) {
  try {
    await prisma.usageLog.create({
      data: {
        model,
        userId,
        chatId,
      },
    });
    
    console.log(`Model usage logged: ${model} for user ${userId}`);
  } catch (error) {
    console.error('Failed to log model usage:', error);
    // Don't throw - logging failures shouldn't break the main functionality
  }
}

export async function getUsageStats(): Promise<UsageStats> {
  try {
    // Get total requests
    const totalRequests = await prisma.usageLog.count();
    
    // Get model usage
    const modelUsageRaw = await prisma.usageLog.groupBy({
      by: ['model'],
      _count: {
        model: true,
      },
    });
    
    const modelUsage: Record<string, number> = {};
    modelUsageRaw.forEach(item => {
      modelUsage[item.model] = item._count.model;
    });
    
    // Get daily usage (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyUsageRaw = await prisma.usageLog.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });
    
    const dailyUsage: Record<string, number> = {};
    dailyUsageRaw.forEach(item => {
      const date = item.createdAt.toISOString().split('T')[0];
      dailyUsage[date] = (dailyUsage[date] || 0) + item._count.id;
    });
    
    // Get unique user count
    const uniqueUsers = await prisma.usageLog.findMany({
      distinct: ['userId'],
      select: {
        userId: true,
      },
    });
    
    return {
      totalRequests,
      modelUsage,
      dailyUsage,
      userCount: uniqueUsers.length,
    };
  } catch (error) {
    console.error('Failed to get usage stats:', error);
    return {
      totalRequests: 0,
      modelUsage: {},
      dailyUsage: {},
      userCount: 0,
    };
  }
}

export async function getUserModelUsage(userId: string): Promise<UsageStats> {
  try {
    // Get total requests for user
    const totalRequests = await prisma.usageLog.count({
      where: {
        userId,
      },
    });
    
    // Get model usage for user
    const modelUsageRaw = await prisma.usageLog.groupBy({
      by: ['model'],
      where: {
        userId,
      },
      _count: {
        model: true,
      },
    });
    
    const modelUsage: Record<string, number> = {};
    modelUsageRaw.forEach(item => {
      modelUsage[item.model] = item._count.model;
    });
    
    // Get daily usage for user (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyUsageRaw = await prisma.usageLog.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });
    
    const dailyUsage: Record<string, number> = {};
    dailyUsageRaw.forEach(item => {
      const date = item.createdAt.toISOString().split('T')[0];
      dailyUsage[date] = (dailyUsage[date] || 0) + item._count.id;
    });
    
    return {
      totalRequests,
      modelUsage,
      dailyUsage,
      userCount: 1, // Always 1 for individual user stats
    };
  } catch (error) {
    console.error('Failed to get user usage stats:', error);
    return {
      totalRequests: 0,
      modelUsage: {},
      dailyUsage: {},
      userCount: 0,
    };
  }
} 