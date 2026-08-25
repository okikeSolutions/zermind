import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Activity, Calendar } from "lucide-react";
import { useUsageStats } from "@/hooks/use-usage";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export default function UsagePage() {
  const { data: stats, isLoading: loading, error } = useUsageStats();

  if (loading) {
    return (
      <div {...sx("container mx-auto p-6")}>
        <div {...sx("flex items-center gap-2 mb-6")}>
          <BarChart3 {...sx("h-6 w-6")} />
          <h1 {...sx("text-2xl font-bold")}>{m.copy_usage_statistics()}</h1>
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
          <h1 {...sx("text-2xl font-bold")}>{m.copy_usage_statistics()}</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div {...sx("text-center text-muted-foreground")}>
              <p>
                {m.copy_error_loading_usage_statistics()} {error?.message || m.copy_unknown_error()}
              </p>
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
          <h1 {...sx("text-2xl font-bold")}>{m.copy_usage_statistics()}</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div {...sx("text-center text-muted-foreground")}>
              <p>{m.copy_no_usage_data_available()}</p>
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
    return m.copy_unknown();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div {...sx("container mx-auto p-6")}>
      <div {...sx("flex items-center gap-2 mb-6")}>
        <BarChart3 {...sx("h-6 w-6")} />
        <h1 {...sx("text-2xl font-bold")}>{m.copy_usage_statistics()}</h1>
      </div>

      {/* Overview Cards */}
      <div {...sx("grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8")}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{m.copy_total_requests()}</CardTitle>
            <Activity {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{stats.totalRequests}</div>
            <p {...sx("text-xs text-muted-foreground")}>{m.copy_all_time_chat_requests()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{m.copy_models_used()}</CardTitle>
            <BarChart3 {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{modelEntries.length}</div>
            <p {...sx("text-xs text-muted-foreground")}>{m.copy_different_ai_models()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{m.copy_recent_activity()}</CardTitle>
            <Calendar {...sx("h-4 w-4 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div {...sx("text-2xl font-bold")}>{dailyEntries.length}</div>
            <p {...sx("text-xs text-muted-foreground")}>{m.copy_active_days_tracked()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Usage */}
      <div {...sx("grid gap-6 md:grid-cols-1 lg:grid-cols-2")}>
        <Card>
          <CardHeader>
            <CardTitle>{m.copy_model_usage()}</CardTitle>
            <CardDescription>{m.copy_ai_models_you_ve_used_and_request_counts()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...sx("space-y-4")}>
              {modelEntries.length === 0 ? (
                <p {...sx("text-muted-foreground text-center py-4")}>
                  {m.copy_no_model_usage_data_available()}
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
            <CardTitle>{m.copy_recent_activity()}</CardTitle>
            <CardDescription>{m.copy_daily_request_counts_over_the_last_week()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...sx("space-y-4")}>
              {dailyEntries.length === 0 ? (
                <p {...sx("text-muted-foreground text-center py-4")}>
                  {m.copy_no_recent_activity_data_available()}
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
