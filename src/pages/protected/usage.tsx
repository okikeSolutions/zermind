import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Activity, Calendar } from "lucide-react";
import { useUsageStats } from "@/hooks/use-usage";
import { sx } from "@/styles/sx";

export default function UsagePage() {
  const { data: stats, isLoading: loading, error } = useUsageStats();

  if (loading) {
    return (
      <div {...sx("container mx-auto p-6")}>
        <div {...sx("flex items-center gap-2 mb-6")}>
          <BarChart3 {...sx("h-6 w-6")} />
          <h1 {...sx("text-2xl font-bold")}>Usage Statistics</h1>
        </div>
        <div {...sx("grid gap-6 md:grid-cols-2 lg:grid-cols-3")}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div {...sx("h-4 bg-muted animate-pulse rounded w-3/4")}></div>
                <div {...sx("h-3 bg-muted animate-pulse rounded w-1/2 mt-2")}></div>
              </CardHeader>
              <CardContent>
                <div {...sx("h-8 bg-muted animate-pulse rounded w-1/4")}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div {...sx("container mx-auto p-6")}>
        <div {...sx("flex items-center gap-2 mb-6")}>
          <BarChart3 {...sx("h-6 w-6")} />
          <h1 {...sx("text-2xl font-bold")}>Usage Statistics</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div {...sx("text-center text-muted-foreground")}>
              <p>Error loading usage statistics: {error?.message || "Unknown error"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div {...sx("container mx-auto p-6")}>
        <div {...sx("flex items-center gap-2 mb-6")}>
          <BarChart3 {...sx("h-6 w-6")} />
          <h1 {...sx("text-2xl font-bold")}>Usage Statistics</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div {...sx("text-center text-muted-foreground")}>
              <p>No usage data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const modelEntries = Object.entries(stats.modelUsage).sort(([, a], [, b]) => b - a);
  const dailyEntries = Object.entries(stats.dailyUsage)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7); // Last 7 days

  const formatModelName = (model: string) => {
    return model
      .replace("openai/", "")
      .replace("anthropic/", "")
      .replace("meta-llama/", "")
      .replace("google/", "");
  };

  const getModelProvider = (model: string) => {
    if (model.startsWith("openai/")) return "OpenAI";
    if (model.startsWith("anthropic/")) return "Anthropic";
    if (model.startsWith("meta-llama/")) return "Meta";
    if (model.startsWith("google/")) return "Google";
    return "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div {...sx("container mx-auto p-6")}>
      <div {...sx("flex items-center gap-2 mb-6")}>
        <BarChart3 {...sx("h-6 w-6")} />
        <h1 {...sx("text-2xl font-bold")}>Usage Statistics</h1>
      </div>

      {/* Overview Cards */}
      <div {...sx("grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8")}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{stats.totalRequests}</div>
            <p {...sx("text-xs text-muted-foreground")}>All-time chat requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models Used</CardTitle>
            <BarChart3 {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{modelEntries.length}</div>
            <p {...sx("text-xs text-muted-foreground")}>Different AI models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{dailyEntries.length}</div>
            <p {...sx("text-xs text-muted-foreground")}>Active days tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Usage */}
      <div {...sx("grid gap-6 md:grid-cols-1 lg:grid-cols-2")}>
        <Card>
          <CardHeader>
            <CardTitle>Model Usage</CardTitle>
            <CardDescription>AI models you&apos;ve used and request counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...sx("space-y-4")}>
              {modelEntries.length === 0 ? (
                <p {...sx("text-muted-foreground text-center py-4")}>
                  No model usage data available
                </p>
              ) : (
                modelEntries.map(([model, count]) => {
                  const percentage = (count / stats.totalRequests) * 100;
                  return (
                    <div key={model} {...sx("space-y-2")}>
                      <div {...sx("flex items-center justify-between")}>
                        <div {...sx("flex items-center gap-2")}>
                          <span {...sx("font-medium")}>{formatModelName(model)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getModelProvider(model)}
                          </Badge>
                        </div>
                        <span {...sx("text-sm text-muted-foreground")}>
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div {...sx("w-full bg-muted rounded-full h-2")}>
                        <div
                          {...sx("bg-primary h-2 rounded-full transition-all duration-300")}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Daily request counts over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...sx("space-y-4")}>
              {dailyEntries.length === 0 ? (
                <p {...sx("text-muted-foreground text-center py-4")}>
                  No recent activity data available
                </p>
              ) : (
                dailyEntries.map(([date, count]) => {
                  const maxCount = Math.max(...dailyEntries.map(([, c]) => c));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={date} {...sx("space-y-2")}>
                      <div {...sx("flex items-center justify-between")}>
                        <span {...sx("font-medium")}>{formatDate(date)}</span>
                        <span {...sx("text-sm text-muted-foreground")}>{count} requests</span>
                      </div>
                      <div {...sx("w-full bg-muted rounded-full h-2")}>
                        <div
                          {...sx("bg-blue-500 h-2 rounded-full transition-all duration-300")}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
