import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/config/routes";
import { getServices } from "@/infrastructure/container";

/** POST only: a link or image on another site must not be able to sign people out. */
export async function POST(request: NextRequest) {
  await getServices().auth.signOut();
  return NextResponse.redirect(new URL(routes.home(), request.url), 303);
}
