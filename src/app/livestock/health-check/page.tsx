
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { LivestockHealthCheckForm } from "./livestock-health-check-form";
  import { Bot } from "lucide-react";
  
  export default function LivestockHealthCheckPage() {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bot className="text-primary" />
              AI-Powered Livestock Health Check
            </CardTitle>
            <CardDescription>
                Upload a photo of an animal and describe its behavior to get a preliminary health assessment from the AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LivestockHealthCheckForm />
          </CardContent>
        </Card>
      </div>
    );
  }
