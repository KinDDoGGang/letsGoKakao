import React from "react";
import { render } from "@testing-library/react";
import NotFound from "../layouts/NotFound";
import AppLayout from "../layouts/AppLayout";

describe("404 NOT FOUND COMPONENT TEST", () => {
    it("renders header", () => {
        const { getByText } = render(<NotFound path="/*" />);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const header = getByText(/^404 not found/);
        expect(header.textContent).toBe("404 not found");
    });

    it("workRequestForm component", () => {
        const { getByText } = render(<AppLayout />);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const header = getByText(/^요청/);
        expect(header.textContent).toBe("요청");
    });
});
