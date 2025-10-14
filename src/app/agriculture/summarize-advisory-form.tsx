
"use client";

import { useState } from "react";
import { summarizeAdvisory } from "@/ai/flows/summarize-advisory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, AlertCircle, FileText, Sparkles } from "lucide-react";

type SummarizeState = {
  summary: string;
  error?: string;
};

export function SummarizeAdvisoryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<SummarizeState>({ summary: "" });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setState({ summary: "", error: undefined }); // Reset on new file
    } else {
      setFile(null);
      setState({ summary: "", error: "Please select a valid PDF file." });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setState({ summary: "", error: "No file selected." });
      return;
    }

    setLoading(true);
    setState({ summary: "", error: undefined });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const pdfDataUri = reader.result as string;
      try {
        const result = await summarizeAdvisory({ pdfDataUri });
        setState({ summary: result.summary });
      } catch (error) {
        console.error(error);
        setState({
          summary: "",
          error: "Failed to generate summary. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setState({ summary: "", error: "Failed to read the file." });
      setLoading(false);
    };
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
        <Button type="submit" disabled={!file || loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card className="p-6 flex flex-col items-center justify-center text-center animate-pulse">
            <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="font-semibold">Analyzing document...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.summary && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-headline text-lg mb-2">Actionable Summary</h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: state.summary.replace(/\n/g, "<br />") }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
