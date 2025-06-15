import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Search } from "lucide-react";

export default function DemoNotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-muted rounded-full">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl">Demo Scenario Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The demo scenario you&apos;re looking for doesn&apos;t exist. Try
            one of our available demos instead.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/demo">
                <Brain className="h-4 w-4 mr-2" />
                Browse All Demos
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Available demos:</p>
            <ul className="mt-2 space-y-1">
              <li>• AI Model Comparison</li>
              <li>• Creative Writing</li>
              <li>• Problem Solving</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
