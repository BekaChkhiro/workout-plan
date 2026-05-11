import { describe, expect, it } from "vitest";

describe("Integration sanity", () => {
  it("runs a trivial async assertion", async () => {
    const value = await Promise.resolve(42);
    expect(value).toBe(42);
  });
});
