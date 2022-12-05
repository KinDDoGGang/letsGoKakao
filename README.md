# 요청 업무 API 서버
카카오페이 사내 서비스 FE 개발자 채용 사전 과제를 위한 Mock API 서버입니다.
- 작성 Node.js 버전: `v18.8.0`
- 실행: `npm run start`
- 서버는 `8080` 포트를 사용하며, 포트 변경이 필요한 경우 `.env` 파일의 `PORT` 속성을 수정하고 서버를 재시작하면 적용됩니다.
- API 호출 시 지연 처리되도록 구성되어 있습니다. 지연 시간 값은 밀리세컨드 단위로 적용 가능하며 `.env` 파일의 `DELAY_MS` 속성을 수정하고 서버를 재시작하면 적용됩니다.
- 초기 데이터는 `db/initial-data.json` 파일에서 확인하실 수 있습니다.
- 해당 API 서버는 별도의 데이터베이스를 사용하지 않고, 메모리에 보관하므로 애플리케이션 종료 또는 재시작 시 추가된 데이터는 보존되지 않습니다.

# API 공통
- 카멜 케이스 네이밍을 사용합니다.
- 로그인 API를 제외한 `/api`로 시작하는 API는 인증을 위한 토큰 값이 필요하며 `Authorization` 헤더에 토큰 값을 전달합니다. `Authorization` 헤더의 값은 타입 구분 없이 토큰 값을 그대로 사용합니다. (`Authorization: TOKEN값`)
  - 토큰은 로그인 API를 통해 획득할 수 있습니다.
  - `Authorization` 헤더가 전달되지 않거나 토큰 값이 잘못된 경우 `401 Unauthorized`로 응답됩니다.
- 응답 상태 코드가 200이 아닌 경우 아래와 같은 공통 오류 응답 포맷을 갖습니다.
    ```json
    {
        "message": "오류 메시지"
    }
    ```
- 타입은 `type.d.ts` 파일을 참고해 주세요.

<완료>
# Login API
사용자명과 비밀번호를 전달하여 토큰을 획득합니다.
- `POST /login`
- Content Type: `application/json`
- 요청 본문 타입: `LoginRequest`
- 응답 본문 타입: `LoginResponse`
- 오류 응답:
  - `400`: 사용자명 또는 비밀번호가 없는 경우
  - `401`: 사용자명 또는 비밀번호가 올바르지 않은 경우

<완료>
# 사용자명 목록
사용명 목록을 조회합니다.
- `GET /api/usernames`
- Content Type: `application/json`
- 응답 본문 타입: `string[]`

<완료>
# 요청 양식 목록 조회 API
요청 양식 목록을 조회합니다. 요청 양식에서 레이블과 아이디만 전달됩니다.
- `GET /api/templates`
- Content Type: `application/json`
- 응답 본문 타입: `TemplateSummary[]`

# 요청 양식 상세 조회 API
단건 요청 양식 상세 정보를 조회합니다.
- `GET /api/templates/:template_id`
- Content Type: `application/json`
- 요청 Path Parameters
  - `template_id`: 요청 양식 아이디
- 응답 본문 타입: `TemplateSummary[]`
- 오류 응답:
  - `404`: `template_id`에 해당하는 요청 양식을 찾을 수 없는 경우
 
<완료>
# 요청서 목록(페이징) 조회 API
작성된 요청서 목록을 조회합니다. 페이징된 포맷으로 응답됩니다.
- `GET /api/requests`
- Content Type: `application/json`
- 요청 Query Parameters
  - `pageNumber`: 페이지 번호, 첫 번째 페이지는 0이 아닌 1부터 시작합니다.
  - `pageSize`: 페이지 크기
- 응답 본문 타입: `RequestListResponse`

# 요청서 상세 조회 API
단건 요청서 상세 정보를 조회합니다.
- `GET /api/requests/:request_id`
- Content Type: `application/json`
- 요청 Path Parameters
  - `request_id`: 요청서 아이디
- 응답 본문 타입: `Request`
- 오류 응답
  - `404`: 요청서 아이디(`request_id`)로 요청서를 찾을 수 없는 경우

<완료>
# 요청서 작성 API
새로운 요청서를 작성합니다. 작성된 요청서를 응답합니다.
- `POST /api/requests`
- Content Type: `application/json`
- 요청 본문 타입: `NewRequest`
- 응답 본문 타입: `Request`
- 오류 응답:
  - `400`: 요청 본문이 잘못되거나 없는 경우
  - `404`: 요청 양식 아이디(`templateId`)로 요청 양식을 찾을 수 없는 경우

# 업무 처리 API
요청서의 현재 단계에서 업무를 처리하고, 다음 단계로 업데이트 합니다. (`Request.currentStepKey`가 다음 `Step`의 `key`로 변경됩니다.)
- `PATCH /api/requests/:request_id/next`
- Content Type: `application/json`
- 요청 Path Parameters
  - `request_id`: 요청서 아이디
- 응답 본문 타입: `Request`
- 오류 응답:
  - `400`: 잘못된 요청(예: 요청서가 이미 마지막 단계인 경우)
  - `403`: 담당자로 지정되지 않은 사용자가 호출한 경우(권한 없음)
  - `404`: 요청 양식 아이디(`templateId`)로 요청 양식을 찾을 수 없는 경우