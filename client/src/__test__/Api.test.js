const { APIRequest, APIAuthRequest } = require("./api");

// 테스트에 사용될 token 정보
let token = undefined;

it("로그인 테스트", async () => {
    const response = await APIRequest("login");

    expect(response.status).toEqual(200);
    expect(response.username).toEqual("brilliant");
    token = response.token;
});

it("템플릿 조회 테스트", async () => {
    const response = await APIAuthRequest(
        "http://127.0.0.1:8080/api/templates",
        "GET",
        {},
        token
    );

    // 템플릿 기본 등록되어 있는 개수 2개 (권한요청, 방화벽요청)
    expect(Object.keys(response).length).toBeGreaterThanOrEqual(2);
});

it("사용자 조회 테스트", async () => {
    const response = await APIAuthRequest(
        "http://127.0.0.1:8080/api/usernames",
        "GET",
        {},
        token
    );

    // 정상적으로 조회 시, 총 10명이었음
    // 정상적으로 조회 시, result 는 string 배열의 형태
    expect(response.length).toBeGreaterThanOrEqual(10);
    expect(typeof response[0]).toBe("string");
    expect(Array.isArray(response)).toBe(true);
});

it("전체 요청 목록 테스트", async () => {
    const response = await APIAuthRequest(
        "http://127.0.0.1:8080/api/requests",
        "GET",
        {},
        token
    );

    // 기본 등록 되어있는 요청목록은 최소 2개, 추가될 수 있음 <Array<Map> 안에 기본으로 들어있는 id는 1 >
    expect((response["content"] || []).length).toBeGreaterThanOrEqual(2);
    expect(response["content"][0]).toEqual(
        expect.objectContaining({
            id: 1,
        })
    );
});

it("요청 목록 상세 테스트", async () => {
    const response = await APIAuthRequest(
        "http://127.0.0.1:8080/api/requests/2",
        "GET",
        {},
        token
    );

    // 요청목록 단건 조회 시 response row에 기본적으로 2건의 데이터가 적재되어 있어서 null이 될 수 없음
    expect(response.row).not.toBeNull();
});
