// Expected failures are values, not exceptions (docs/03-architecture.md §10, docs/07 §5).
// Server actions return Result and never throw to the client.

/** Every expected failure the UI knows how to explain. Message text lives in i18n under `errors.*`. */
export type AppErrorCode =
  | "validation"
  | "auth_required"
  | "forbidden"
  | "rate_limited"
  | "not_found"
  | "conflict"
  | "unknown";

export type AppError = {
  code: AppErrorCode;
  /** Per-field problems for forms (validation only): field path → i18n key or message. */
  fields?: Record<string, string>;
  /** Seconds until a rate-limited action may be retried. */
  retryAfter?: number;
};

export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function err<E = AppError>(error: E): Result<never, E> {
  return { ok: false, error };
}

/** Shorthand for the common case: err({ code }). */
export function fail(code: AppErrorCode, extra?: Omit<AppError, "code">): Result<never, AppError> {
  return err({ code, ...extra });
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; data: T } {
  return result.ok;
}
