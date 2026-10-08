import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/config/routes";
import { getServices } from "@/infrastructure/container";
import { safeNext } from "@/lib/auth/safe-next";

/** Starts Google sign-in: sends the visitor to Google, which returns to /auth/callback. */
export async function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const callback = new URL(routes.authCallback(), request.url);
  callback.searchParams.set("next", next);
  try {
    const target = await getServices().auth.signInWithGoogleUrl(callback.toString());
    return NextResponse.redirect(new URL(target, request.url));
  } catch (error) {
    getServices().errors.report(error, { route: "auth/sign-in" });
    return NextResponse.redirect(new URL(routes.login({ next, error: true }), request.url));
  }
}
