"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { parsePdfApplicationPreview } from "@/app/(authenticated)/(admin)/admin/actions";
import {
  ApiResponse,
  CreateRusheeResponse,
  PythonApiResponse,
} from "@/lib/types";
import { RusheePreviewForm } from "./RusheePreviewForm";

export function PdfUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] =
    useState<ApiResponse<CreateRusheeResponse> | null>(null);
  const [previewData, setPreviewData] = useState<PythonApiResponse | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Clear previous results
      setPreviewData(null); // Clear previous preview data
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setResult({
        success: false,
        message: "Please select a PDF file",
        error: "No file selected",
      });
      return;
    }

    setResult(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await parsePdfApplicationPreview(null, formData);

      if (result.success && result.data) {
        setPreviewData(result.data);
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById(
          "pdf-file"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setResult({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    });
  };

  const handlePreviewCancel = () => {
    setPreviewData(null);
    setResult(null);
  };

  const handlePreviewSuccess = (result: ApiResponse<CreateRusheeResponse>) => {
    setResult(result);
    setPreviewData(null);
  };

  // Show preview form if we have parsed data
  if (previewData) {
    return (
      <RusheePreviewForm
        parsedData={previewData}
        onCancel={handlePreviewCancel}
        onSuccess={handlePreviewSuccess}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Application Parser
        </CardTitle>
        <CardDescription>
          Upload a PDF application form to parse and review rushee data before
          creating records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">Select PDF File</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isPending}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Only PDF files up to 10MB are allowed.
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-sm text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!file || isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing PDF...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Preview
              </>
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6">
            {result.success ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-semibold mb-2">{result.message}</div>
                  {result.data && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Rushee:</strong> {result.data.rushee.name} (
                        {result.data.rushee.email})
                      </div>
                      <div>
                        <strong>Availabilities:</strong>{" "}
                        {result.data.availabilities.length} time slots created
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="font-semibold mb-1">{result.message}</div>
                  {result.error && (
                    <div className="text-sm text-red-600">{result.error}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
