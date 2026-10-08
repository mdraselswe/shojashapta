import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/config/routes";
import { getServices } from "@/infrastructure/container";
import { safeNext } from "@/lib/auth/safe-next";

/** Google sends the visitor back here with a one-time `code`; swap it for a session and go on. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeNext(params.get("next"));
  const code = params.get("code") ?? params.get("mock");
  try {
    const ok = await getServices().auth.completeSignIn(code);
    if (ok) return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    getServices().errors.report(error, { route: "auth/callback" });
  }
  return NextResponse.redirect(new URL(routes.login({ next, error: true }), request.url));
}
