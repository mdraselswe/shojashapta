import type { z } from "zod";

import type { AppUser } from "@/core/domain";
import {
  AuthRequiredError,
  type AuthProvider,
  type ErrorReporter,
  type RateLimitedAction,
  type RateLimiter,
} from "@/core/ports";
import { err, fail, type AppError, type Result } from "@/lib/result";

// Server action pipeline (docs/03-architecture.md §7): validate → auth → rate limit → handler,
// always returning Result. Pure: the container supplies the adapters (createDefineAction).

type ActionOptions = {
  /** Require a signed-in, non-banned user. */
  auth?: boolean;
  /** Count against this daily limit (needs auth). */
  rateLimit?: RateLimitedAction;
};

type Context<S, Auth extends boolean> = {
  services: S;
  user: Auth extends true ? AppUser : AppUser | null;
};

type Deps<S> = {
  auth: () => AuthProvider;
  rateLimiter: () => RateLimiter;
  errors: () => ErrorReporter;
  services: () => S;
};

/** Field path → first message, for form errors. */
function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    fields[path] ??= issue.message;
  }
  return fields;
}

export function createDefineAction<S>(deps: Deps<S>) {
  return function defineAction<Schema extends z.ZodType, T, Auth extends boolean = false>(
    schema: Schema,
    handler: (input: z.infer<Schema>, context: Context<S, Auth>) => Promise<Result<T>>,
    options: ActionOptions & { auth?: Auth } = {},
  ) {
    return async (rawInput: unknown): Promise<Result<T>> => {
      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) return fail("validation", { fields: fieldErrors(parsed.error) });

      try {
        let user: AppUser | null = null;
        if (options.auth || options.rateLimit) {
          user = await deps.auth().requireUser();
          if (user.isBanned) return fail("forbidden");
        }
        if (options.rateLimit && user) {
          const decision = await deps.rateLimiter().consume(user.id, options.rateLimit);
          if (!decision.allowed) return fail("rate_limited", { retryAfter: decision.retryAfter });
        }
        return await handler(parsed.data, { services: deps.services(), user } as Context<S, Auth>);
      } catch (error) {
        if (error instanceof AuthRequiredError) return fail("auth_required");
        deps.errors().report(error, { action: handler.name || "anonymous" });
        return err<AppError>({ code: "unknown" });
      }
    };
  };
}
