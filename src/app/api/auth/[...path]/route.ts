import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = "http://localhost:5050/api/auth";

async function proxy(req: NextRequest, pathParts: string[] = []) {
  const url = `${BACKEND_BASE}/${pathParts.join("/")}`;

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.arrayBuffer();

  const headers: Record<string, string> = {};

  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const cookie = req.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;

  const backendRes = await fetch(url, {
    method: req.method,
    headers,
    body: body as any,
    redirect: "manual",
  });

  const resHeaders = new Headers();
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) resHeaders.set("set-cookie", setCookie);

  const data = await backendRes.arrayBuffer();

  return new NextResponse(data, {
    status: backendRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: NextRequest, ctx: any) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: any) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: any) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: any) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: any) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
