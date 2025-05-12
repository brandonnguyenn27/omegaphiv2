import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  console.log("Auth GET request received:", request.url);
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  console.log("Auth POST request received:", request.url);
  return handler.POST(request);
}
