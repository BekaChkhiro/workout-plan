import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { MobileShell } from "@/components/MobileShell";

describe("Vitest + RTL sanity", () => {
  it("renders children inside MobileShell", () => {
    render(
      <MobileShell>
        <p>hello</p>
      </MobileShell>,
    );

    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
