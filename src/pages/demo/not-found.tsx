import Link from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Search } from "lucide-react";
import { DEMO_SCENARIOS } from "@/constants/demo-scenarios";
import { sx } from "@/styles/sx";

export default function DemoNotFound() {
  return (
    <div {...sx("h-screen w-full flex items-center justify-center p-4")}>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div {...sx("flex justify-center mb-4")}>
            <div {...sx("p-3 bg-muted rounded-full")}>
              <Search {...sx("h-8 w-8 text-muted-foreground")} />
            </div>
          </div>
          <CardTitle className="text-xl">Demo Scenario Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p {...sx("text-muted-foreground")}>
            The demo scenario you&apos;re looking for doesn&apos;t exist. Try one of our available
            demos instead.
          </p>

          <div {...sx("space-y-2")}>
            <Button render={<Link href="/demo" />} nativeButton={false} className="w-full">
              <Brain {...sx("h-4 w-4 mr-2")} />
              Browse All Demos
            </Button>

            <Button
              variant="outline"
              render={<Link href="/" />}
              nativeButton={false}
              className="w-full"
            >
              <ArrowLeft {...sx("h-4 w-4 mr-2")} />
              Back to Home
            </Button>
          </div>

          <div {...sx("text-sm text-muted-foreground")}>
            <p>Available demos:</p>
            <ul {...sx("mt-2 space-y-1")}>
              {Object.entries(DEMO_SCENARIOS).map(([key, scenario]) => (
                <li key={key}>• {scenario.title}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
