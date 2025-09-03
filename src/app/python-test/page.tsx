"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

// Simple API function
const fetchHello = async () => {
  const response = await fetch("/api/python/hello");
  if (!response.ok) throw new Error("Failed to fetch hello");
  return response.json();
};

export default function PythonBackendTest() {
  const helloQuery = useQuery({
    queryKey: ["hello"],
    queryFn: fetchHello,
    enabled: false, // Don't fetch automatically
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Python Backend Test</h1>
        <p className="text-muted-foreground">
          Simple test of your Python backend on Vercel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Python Endpoint</CardTitle>
          <CardDescription>
            Click the button to test your Python backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => helloQuery.refetch()}
            disabled={helloQuery.isFetching}
            className="w-full"
          >
            {helloQuery.isFetching ? "Testing..." : "Test Python Backend"}
          </Button>
        </CardContent>
      </Card>

      {/* Response Display */}
      {helloQuery.data && (
        <Card>
          <CardHeader>
            <CardTitle>Response from Python</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(helloQuery.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {helloQuery.error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-destructive">
              {helloQuery.error.message}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Deploy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            1. Install Vercel CLI: <code>npm i -g vercel</code>
          </p>
          <p>
            2. Deploy: <code>vercel</code>
          </p>
          <p>
            3. Your Python endpoint will be at: <code>/api/python/hello</code>
          </p>
          <p className="mt-4 text-muted-foreground">
            Note: Python functions only work when deployed to Vercel, not
            locally.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
