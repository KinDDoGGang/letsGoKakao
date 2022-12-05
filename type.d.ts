// 공통 오류 응답
interface ErrorResponse {
    // 오류 메시지
    message?: string
}

// 로그인 요청 본문
interface LoginRequest {
    // 사용자명
    username: string;
    // 비밀번호
    password: string;
}

// 로그인 응답 본문
interface LoginResponse {
    // 인증 토큰(API 호출 시 Authorization 헤더의 값으로 전달)
    token: string;
    // 사용자명
    username: string;
}

// 요청 양식 목록 아이템
interface TemplateSummary {
    // 화면 표시를 위한 요청 양식 레이블
    label: string;
    // 요청 양식 아이디
    id: string;
}

// 요청 양식 상세
interface Template {
    // 요청 양식 아이디
    id: string;
    // 요청 양식 레이블
    label: string;
    // 요청 입력 항목 목록
    fields: Field[];
    // 요청 업무 단계 목록
    steps: TemplateStep[];
    // 작성 일시(타임 스탬프)
    createdAt: number;
    // 수정 일시(타임 스탬프)
    updatedAt: number;
}

// 요청 입력 항목 상세
interface Field {
    // 타입
    type: "text" | "richtext" | "username" | "date";
    // 입력 항목 키(데이터의 속성 이름으로 사용)
    key: string;
    // 표시 레이블
    label: string;
    // 유효성 검증 속성
    validation?: Validation
}

// 요청 입력 항목의 유효성 검증 속성
// 각 속성이 있는 경우에만 유효성 검증 수행
interface Validation {
    // 필수 여부
    required?: boolean;
    // 입력 최대 길이
    maxLength?: number;
    // 입력 최소 길이
    minLength?: number;
    // 패턴 확인을 위한 정규표현식
    regexp?: string;
}

// 요청 업무 단계 목록(템플릿용 - 담당자 없음)
interface TemplateStep {
    // 업무 단계 레이블
    label: string;
    // 단계 식별키
    key: string;
    // 업무 처리 레이블
    actionLabel: string;
}

// 요청서 작성 본문
interface NewRequest {
    // 요청 양식 아이디
    templateId?: string;
    // 요청서 제목
    title?: string;
    // 요청 단계별 담당자 목록
    assignees: string[]
    // 요청 입력 항목(Object)
    /**
     * JavaScript Object로 구성되며 요청 양식의 각 입력 항목(Field)가 
     * 객체의 속성으로 구성되며 Field.key가 객체의 속성 이름이 됩니다.
     * ex) field의 key가 username인 경우
     * {
     *   username: 'somebody'
     * }
     */
    data: any;
}

// 요청 업무 단계 목록(요청서용)
interface RequestStep extends TemplateStep {
    // 담당자 사용자명
    assignee?: string;
}

// 요청 목록 응답(페이징)
interface RequestListResponse {
    // 페이징된 요청서 상세 목록
    content: Request[],
    // 다음 페이지 존재 여부
    hasNext: boolean;
    // 페이지 번호(시작 값은 0이 아닌 1)
    pageNumber: number;
    // 페이지 크기
    pageSize: number;
    // 전체 요청서 수
    totalCount: number;
    // 전체 페이지 수
    totalPage: number;
}

// 요청서 상세
interface Request {
    // 요청 양식 아이디
    templateId: string;
    // 현재 진행 단계의 키
    currentStepKey: string;
    // 요청서 아이디
    id: number;
    // 요청서 제목
    title: string;
    // 요청서 작성자
    requestedBy: string;
    // 요청 입력 항목
    data?: any;
    // 요청 단계 목록
    steps: RequestStep[];
    // 요청서 작성 일시(타임스탬프)
    createdAt: number;
    // 요청서 수정 일시(타임스탬프)
    updatedAt: number;
}

// 요청서 댓글
interface Comment {
    // 댓글 작성자
    writtenBy: string; 
    // 댓글 내용
    contents: string;
    // 댓글 작성일시(타임스탬프)
    createdAt: number;
}