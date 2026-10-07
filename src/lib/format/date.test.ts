import { describe, expect, it } from "vitest";

import { daysSince, formatDate, timeAgo } from "./date";

const now = new Date("2026-10-07T12:00:00Z");
const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000);

describe("timeAgo", () => {
  it("says just now for under a minute and for future times", () => {
    expect(timeAgo(ago(30), now)).toBe("এইমাত্র");
    expect(timeAgo(ago(-120), now)).toBe("এইমাত্র");
  });

  it.each([
    [5 * 60, "৫ মিনিট আগে"],
    [3 * 3600, "৩ ঘণ্টা আগে"],
    [5 * 86400, "৫ দিন আগে"],
    [15 * 86400, "২ সপ্তাহ আগে"],
    [65 * 86400, "২ মাস আগে"],
    [400 * 86400, "১ বছর আগে"],
  ])("%i seconds → %s", (seconds, expected) => {
    expect(timeAgo(ago(seconds), now)).toBe(expected);
  });

  it("accepts ISO strings", () => {
    expect(timeAgo("2026-10-02T12:00:00Z", now)).toBe("৫ দিন আগে");
  });
});

describe("daysSince", () => {
  it("counts whole days and never goes negative", () => {
    expect(daysSince(ago(40 * 86400 + 100), now)).toBe(40);
    expect(daysSince(ago(-86400), now)).toBe(0);
  });
});

describe("formatDate", () => {
  it("formats in Bangladesh time", () => {
    // 20:00 UTC is already the next day in Dhaka (UTC+6).
    expect(formatDate("2026-10-07T20:00:00Z")).toBe("৮ অক্টোবর, ২০২৬");
  });
});
