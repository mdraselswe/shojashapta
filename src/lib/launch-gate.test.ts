import { describe, expect, it } from "vitest";

import { decideLaunchGate, previewToken } from "./launch-gate";

const secret = "founding-friends";
const base = { launched: false, secret, previewParam: null, cookie: undefined };

describe("decideLaunchGate", () => {
  it("is open for everyone once launched", async () => {
    expect(await decideLaunchGate({ ...base, launched: true, secret: undefined })).toEqual({
      kind: "open",
    });
  });

  it("gates visitors without preview access", async () => {
    expect(await decideLaunchGate(base)).toEqual({ kind: "gate" });
  });

  it("grants access for the right secret and stores only its hash", async () => {
    const decision = await decideLaunchGate({ ...base, previewParam: secret });
    expect(decision).toEqual({ kind: "grant", token: await previewToken(secret) });
    expect(decision.kind === "grant" && decision.token).not.toBe(secret);
  });

  it("gates a wrong secret", async () => {
    expect(await decideLaunchGate({ ...base, previewParam: "guess" })).toEqual({ kind: "gate" });
  });

  it("opens for a valid preview cookie", async () => {
    expect(await decideLaunchGate({ ...base, cookie: await previewToken(secret) })).toEqual({
      kind: "open",
    });
  });

  it("rejects a cookie holding the raw secret or a stale token", async () => {
    expect(await decideLaunchGate({ ...base, cookie: secret })).toEqual({ kind: "gate" });
    expect(await decideLaunchGate({ ...base, cookie: await previewToken("old-secret") })).toEqual({
      kind: "gate",
    });
  });

  it("allows no bypass when no secret is configured", async () => {
    expect(
      await decideLaunchGate({ ...base, secret: undefined, previewParam: "", cookie: "" }),
    ).toEqual({ kind: "gate" });
  });
});
