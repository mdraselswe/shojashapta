import { NextResponse, type NextRequest } from "next/server";

import { appConfig } from "@/config/app.config";
import { clientEnv, serverEnv } from "@/config/env";
import { routes } from "@/config/routes";
import { decideLaunchGate, PREVIEW_COOKIE, PREVIEW_PARAM } from "@/lib/launch-gate";

export async function proxy(request: NextRequest) {
  const launched = clientEnv.NEXT_PUBLIC_LAUNCHED;
  const decision = await decideLaunchGate({
    launched,
    secret: serverEnv().PREVIEW_ACCESS_SECRET,
    previewParam: request.nextUrl.searchParams.get(PREVIEW_PARAM),
    cookie: request.cookies.get(PREVIEW_COOKIE)?.value,
  });

  let response: NextResponse;
  if (decision.kind === "grant") {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete(PREVIEW_PARAM);
    response = NextResponse.redirect(cleanUrl);
    response.cookies.set(PREVIEW_COOKIE, decision.token, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: appConfig.launch.previewCookieMaxAgeDays * 24 * 60 * 60,
    });
  } else if (decision.kind === "gate") {
    response = NextResponse.rewrite(new URL(routes.comingSoon(), request.url));
  } else {
    response = NextResponse.next();
  }

  // Nothing is indexed before launch, including what preview users see.
  if (!launched) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Every page; not API routes, Next internals or files with an extension (icons, images, robots.txt…).
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
