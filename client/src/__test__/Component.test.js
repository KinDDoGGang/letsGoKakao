import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "../layouts/NotFound";
import CustomDropdownList from "../components/CustomDropdownList/CustomDropdownList";
import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";

const { APIRequest, APIAuthRequest } = require("./api");

// 테스트에 사용될 token 정보
let token = undefined;

describe("컴포넌트가 정상적으로 렌더링 되는지 테스트", () => {
    it("renders header", () => {
        const { getByText } = render(<NotFound path="/*" />);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const header = getByText(/^404 not found/);
        expect(header.textContent).toBe("404 not found");
    });

    it("로그인 테스트", async () => {
        const response = await APIRequest("login");

        expect(response.status).toEqual(200);
        expect(response.username).toEqual("brilliant");
        token = response.token;
    });

    it("CustomDropdownList Component", async () => {
        const userList = await APIAuthRequest(
            "http://127.0.0.1:8080/api/usernames",
            "GET",
            {},
            token
        );

        const { getByText, getByTestId } = render(
            <CustomDropdownList
                TemplateList={userList}
                isLocationed={null}
                placeText={"테스트"}
            />
        );
        //eslint-disable-next-line testing-library/prefer-screen-queries
        const header = screen.getByText(/테스트/);
        expect(header).not.toBe(null);
    });
});
