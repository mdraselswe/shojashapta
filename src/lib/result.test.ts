import { describe, expect, it } from "vitest";

import { err, fail, isOk, ok } from "./result";

describe("Result", () => {
  it("builds success and failure values", () => {
    expect(ok(1)).toEqual({ ok: true, data: 1 });
    expect(err({ code: "not_found" })).toEqual({ ok: false, error: { code: "not_found" } });
    expect(fail("rate_limited", { retryAfter: 30 })).toEqual({
      ok: false,
      error: { code: "rate_limited", retryAfter: 30 },
    });
  });

  it("narrows with isOk", () => {
    const result = Math.random() > 2 ? fail("unknown") : ok("দই");
    if (isOk(result)) expect(result.data).toBe("দই");
    else throw new Error("expected ok");
  });
});
