import { NextResponse } from "next/server";

import { serverEnv } from "@/config/env";

/** Stands in for Cloudinary when NEXT_PUBLIC_STORAGE_PROVIDER=mock: accepts the upload, keeps nothing. */
export async function POST(request: Request) {
  if (serverEnv().VERCEL_ENV === "production") return new NextResponse(null, { status: 404 });
  await request.arrayBuffer();
  return NextResponse.json({ ok: true });
}
