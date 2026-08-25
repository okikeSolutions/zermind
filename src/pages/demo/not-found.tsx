import Link from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Search } from "lucide-react";
import { DEMO_SCENARIOS } from "@/constants/demo-scenarios";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
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
          <CardTitle className="text-xl">{m.copy_demo_scenario_not_found()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p {...sx("text-muted-foreground")}>
            {m.copy_the_demo_scenario_you_re_looking_for_doesn_t_exist_try_one_of_ou()}
          </p>

          <div {...sx("space-y-2")}>
            <Button render={<Link href="/demo" />} nativeButton={false} className="w-full">
              <Brain {...sx("h-4 w-4 mr-2")} /> {m.copy_browse_all_demos()}
            </Button>

            <Button
              variant="outline"
              render={<Link href="/" />}
              nativeButton={false}
              className="w-full"
            >
              <ArrowLeft {...sx("h-4 w-4 mr-2")} /> {m.copy_back_to_home_2()}
            </Button>
          </div>

          <div {...sx("text-sm text-muted-foreground")}>
            <p>{m.copy_available_demos()}</p>
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
