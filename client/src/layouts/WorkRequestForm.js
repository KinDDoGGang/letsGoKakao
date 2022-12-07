import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";
import CustomDropdownList from "../components/CustomDropdownList/CustomDropdownList";
import CustomInput from "../components/CustomInput/CustomInput";

import AddressForm from "../layouts/AddresForm";
import FirewallForm from "../layouts/FirewallForm";
import Header from "../layouts/Header";

import {
    callAuthApi,
    getToday,
    makeWorkRequestListColumn,
    makeWorkRequestListRows,
} from "../utils/utils";

/** TODO 시간되면 상단에 로그인한 사용자명 표시해줘도 좋을 듯, 로그아웃버튼 추가하고 */
/*  TODO Enter 칠 때, 요청서 제출버튼 클릭되도록 수정 필요 후순위 */
/*  TODO 요청서 제출 후 다른 아이디로 로그인해서 들어와도 작성했던 요청서 남아있음, 그거로 로그인한 사용자가
    요청목록에서 들어갔을 때, 담당자가 본인이면 해당 스탭에 해당하는 권한의 버튼값 활성/비활성 처리 해야할듯
*/

/* step 밑에 dropdownbox 추가 */
const permissionSteps = ["승인 요청", "처리 중", "처리 완료"];
const firewallSteps = ["승인 요청", "정책 검토", "방화벽 설정", "설정 완료"];

/* TODO 여기 snackbar settimeout cleartimeout 해줘야함 */
let timeoutSnackbar = undefined;

/* step 별 구분 필요할 때 사용예정 */
function getStepContent(step) {
    switch (step) {
        case 0:
            return null;
        case 1:
        //   return <PaymentForm />;
        case 2:
        //   return <Review />;
        default:
            throw new Error("Unknown step");
    }
}

const theme = createTheme();

export default function WorkRequestForm() {
    const history = useNavigate();
    const location = useLocation();

    // 요청양식에서 사용하는 ref....
    const workRequestFormRef = {
        selectedTemplateRef: useRef(),
        titleRef: useRef(),
        userRef: useRef(),
        managerRef: useRef(),
        giveUserRef: useRef(),
        wantDateRef: useRef(),

        // 방화벽 설정 부분
        approvalRef: useRef(),
        reviewerRef: useRef(),
        firewallRef: useRef(),
        destinationRef: useRef(),
        sourceRef: useRef(),
    };

    const [activeStep, setActiveStep] = useState(0);
    // 템플릿 순번, ID
    const [selectedTemplate, setSelectedTemplate] = useState("99");
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    // 제목
    const [title, setTitle] = useState("");
    // 승인 담당자 ID, 이름 ( asignee )
    const [selectedUser, setSelectedUser] = useState("99");
    const [selectedUserName, setSelectedUserName] = useState("");
    // 처리 담당자 ID, 이름
    const [selectedManager, setSelectedManager] = useState("99");
    const [selectedManagerName, setSelectedManagerName] = useState("");
    // 부여 대상자
    const [selectedGiveUser, setSelectedGiveUser] = useState("99");
    const [selectedGiveUserName, setSelectedGiveUserName] = useState("");
    // 요청 내용 상세
    const [selectedDetails, setSelectedDetails] = useState("");
    // 처리 희망일
    const [selectedWantDate, setSelectedWantDate] = useState(getToday());

    // 방화벽 승인 담당자 ID, 이름
    const [selectedApproval, setSelectedApproval] = useState("99");
    const [selectedApprovalName, setSelectedApprovalName] = useState("");

    // 방화벽 정책 담당자
    const [selectedReviewer, setSelectedReviewer] = useState("99");
    const [selectedReviewerName, setSelectedReviewerName] = useState("");

    // 방화벽 설정 담당자
    const [selectedFirewall, setSelectedFirewall] = useState("99");
    const [selectedFirewallName, setSelectedFirewallName] = useState("");

    // 출발지 IP
    const [selectedDestination, setSelectedDestination] = useState("");
    // 도착지 IP
    const [selectedSource, setSelectedSource] = useState("");

    const { templateList, userList } = useOutletContext();

    const [progress, setProgress] = useState(false);

    const [AlertFlag, setAlertFlag] = useState({
        message: "",
        showError: false,
        backgroundColor: "",
    });

    const pages = ["HOME / ", "요청하기"];

    /* 권한부여 스탭 */
    const handleProgress = async () => {
        const token = localStorage.getItem("login-token");
        const id = location.state.id || 1;

        try {
            const result = await callAuthApi(
                `http://127.0.0.1:8080/api/requests/${id}/next`,
                "PATCH",
                {},
                token
            );

            /* 권한처리 스탭으로 이동 */
            if (
                (result.currentStepKey || "") !== "" &&
                result.currentStepKey === "DONE"
            ) {
                setActiveStep(2);

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: "권한 부여 되었습니다.",
                    backgroundColor: "#1565c0",
                });

                setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                }, 1000);
            } else {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "",
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleFirewall = async () => {
        const token = localStorage.getItem("login-token");
        const id = location.state.id || 1;

        try {
            const result = await callAuthApi(
                `http://127.0.0.1:8080/api/requests/${id}/next`,
                "PATCH",
                {},
                token
            );

            /* 권한처리 스탭으로 이동 */
            if (
                (result.currentStepKey || "") !== "" &&
                result.currentStepKey === "DONE"
            ) {
                setActiveStep(3);

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: "방화벽 설정 완료 되었습니다.",
                    backgroundColor: "#1565c0",
                });

                setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                }, 1000);
            } else {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "",
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleFirewallProgress = async () => {
        const token = localStorage.getItem("login-token");
        const id = location.state.id || 1;

        try {
            const result = await callAuthApi(
                `http://127.0.0.1:8080/api/requests/${id}/next`,
                "PATCH",
                {},
                token
            );

            /* 권한처리 스탭으로 이동 */
            if (
                (result.currentStepKey || "") !== "" &&
                result.currentStepKey === "SETTING"
            ) {
                setActiveStep(2);

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: "정책 검토가 완료 되었습니다.",
                    backgroundColor: "#1565c0",
                });

                setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                }, 1000);
            } else {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "",
                });
            }
            ((result || { currentStepKey: "" }).currentStepKey || "") !== "" &&
                goFirewallStep(result.steps[2].assignee);
        } catch (e) {
            console.error(e);
        }
    };

    /* 승인처리 스탭 */
    const handleApprove = async () => {
        const token = localStorage.getItem("login-token");
        const id = location.state.id || 1;

        try {
            const result = await callAuthApi(
                `http://127.0.0.1:8080/api/requests/${id}/next`,
                "PATCH",
                {},
                token
            );

            /* 권한처리 스탭으로 이동 */
            if (
                (result.currentStepKey || "") !== "" &&
                result.currentStepKey === "IN_PROGRESS"
            ) {
                setActiveStep(1);

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: "승인 처리 되었습니다.",
                    backgroundColor: "#1565c0",
                });

                setProgress(true);

                setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                    setProgress(false);
                }, 1000);
            } else {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "",
                });
            }

            ((result || { currentStepKey: "" }).currentStepKey || "") !== "" &&
                goProgressStep(result.steps[1].assignee);
        } catch (e) {
            console.error(e);
        }
    };

    const handleFirewallApprov = async () => {
        const token = localStorage.getItem("login-token");
        const id = location.state.id || 1;

        try {
            const result = await callAuthApi(
                `http://127.0.0.1:8080/api/requests/${id}/next`,
                "PATCH",
                {},
                token
            );

            /* 정책 검토 스탭으로 이동 */
            if (
                (result.currentStepKey || "") !== "" &&
                result.currentStepKey === "CHECKING_POLICY"
            ) {
                setActiveStep(1);

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: "승인 처리 되었습니다.",
                    backgroundColor: "#1565c0",
                });

                setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                }, 1000);
            } else {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "",
                });
            }
            ((result || { currentStepKey: "" }).currentStepKey || "") !== "" &&
                goFirewallReviewerStep(result.steps[1].assignee);
        } catch (e) {
            console.error(e);
        }
    };

    const handleNavMenu = (event) => {
        if (event.target.innerText.includes("HOME")) {
            history("/workRequest");
        } else if (event.target.innerText.includes("요청하기")) {
            history("/workRequest/workRequestForm");
        }
    };

    const handleCloseSnackbar = () => {
        /** clearTimeout 어디서할지 찾아봐야함 */
        timeoutSnackbar = setTimeout(() => {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
            });
        }, 1300);
    };

    // 양식 콜백
    const callbackTemplate = (callbackTemplate) => {
        const splitedTemplate = (callbackTemplate || "").split(",");
        setSelectedTemplate(splitedTemplate[0]);
        setSelectedTemplateId(splitedTemplate[1]);
    };

    // 제목 콜백
    const callbackTitle = (callbackTitle) => {
        setTitle(callbackTitle);
    };

    // 권한요청 승인 담당자 콜백
    const callbackUser = (callbackUser) => {
        const splitedUser = (callbackUser || "").split(",");
        setSelectedUser(splitedUser[0]);
        setSelectedUserName(splitedUser[1]);
    };

    // 처리 담당자 콜백
    const callbackManager = (callbackManager) => {
        const splitedManager = (callbackManager || "").split(",");
        setSelectedManager(splitedManager[0]);
        setSelectedManagerName(splitedManager[1]);
    };

    // 부여대상 사용자 콜백
    const callbackGiveUser = (callbackGiveUser) => {
        const splitedGiveUser = (callbackGiveUser || "").split(",");
        setSelectedGiveUser(splitedGiveUser[0]);
        setSelectedGiveUserName(splitedGiveUser[1]);
    };

    // 방화벽설정 - 승인담당자 콜백
    const callbackApprovUser = (callbackApprovUser) => {
        const splitedApproval = (callbackApprovUser || "").split(",");
        setSelectedApproval(splitedApproval[0]);
        setSelectedApprovalName(splitedApproval[1]);
    };

    // 방화벽설정 - 처리담당자 콜백
    const callbackReviewer = (callbackReviewer) => {
        const splitedReviewer = (callbackReviewer || "").split(",");
        setSelectedReviewer(splitedReviewer[0]);
        setSelectedReviewerName(splitedReviewer[1]);
    };

    // 방화벽설정 - 방화벽담당자 콜백
    const callbackFirewall = (callbackFirewall) => {
        const splitedFirewall = (callbackFirewall || "").split(",");
        setSelectedFirewall(splitedFirewall[0]);
        setSelectedFirewallName(splitedFirewall[1]);
    };

    // 요청내용 상세 콜백
    const callbackDetails = (callbackDetails) => {
        setSelectedDetails(callbackDetails);
    };

    // 처리희망일자 콜백
    const callbackWantDate = (callbackWantDate) => {
        setSelectedWantDate(callbackWantDate);
    };

    // 출발지IP 콜백
    const callbackDestination = (callbackDestination) => {
        setSelectedDestination(callbackDestination);
    };

    // 도착지 IP 콜백
    const callbackSource = (callbackSource) => {
        setSelectedSource(callbackSource);
    };

    useEffect(() => {
        // 현재 단계 표시 (요청 목록에서 들어올 경우)
        if (Object.keys(location.state || {}).length > 0) {
            const templateType = location.state.totList.templateId;

            if (templateType.includes("permission")) {
                const currentStep =
                    location.state.currentStepKey || "APPROVAL_REQUESTED";
                const resultStep =
                    currentStep === "APPROVAL_REQUESTED"
                        ? 0
                        : currentStep === "IN_PROGRESS"
                        ? 1
                        : 2;
                setActiveStep(resultStep);
                setSelectedTemplate("1");
            } else {
                const currentStep =
                    location.state.currentStepKey || "APPROVAL_REQUESTED";
                const resultStep =
                    currentStep === "APPROVAL_REQUESTED"
                        ? 0
                        : currentStep === "CHECKING_POLICY"
                        ? 1
                        : currentStep === "SETTING"
                        ? 2
                        : 3;
                setActiveStep(resultStep);
                setSelectedTemplate("2");
            }
        }
    }, []);

    const doSubmit = async () => {
        let param = {};

        if (Number(selectedTemplate) === 1) {
            param = {
                templateId: selectedTemplateId,
                title: title,
                assignees: [
                    // `${selectedUser},${selectedUserName}`,
                    // `${selectedManager},${selectedManagerName}`,
                    selectedUserName,
                    selectedManagerName,
                ],
                data: {
                    // targetUsername: `${selectedGiveUser},${selectedGiveUserName}`,
                    targetUsername: selectedGiveUserName,
                    details: selectedDetails,
                    date: selectedWantDate,
                },
            };
        } else {
            param = {
                templateId: selectedTemplateId,
                title: title,
                assignees: [
                    `${selectedApprovalName}`,
                    `${selectedReviewerName}`,
                    `${selectedFirewallName}`,
                ],
                data: {
                    destination: selectedDestination,
                    source: selectedSource,
                },
            };
        }

        const token = localStorage.getItem("login-token");
        try {
            const result = await callAuthApi(
                "http://127.0.0.1:8080/api/requests",
                "POST",
                param,
                token
            );

            // 결과값이 존재하지 않을 경우
            if (result && (result.id || "") === "") {
                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    message: result.message || "통신 중 오류가 발생하였습니다.",
                });

                // 로그인이 필요할 경우 로그인페이지로 이동
                setTimeout(() => {
                    result.message.includes("로그인") && history("/");
                }, 1000);
            } else {
                let params = undefined;
                const columns = makeWorkRequestListColumn;

                setAlertFlag({
                    ...AlertFlag,
                    showError: !AlertFlag.showError,
                    backgroundColor: "#1565c0",
                    message: "요청서를 성공적으로 제출하였습니다.",
                });

                /* 아무것도 없을 때 noRows >> rows: [], totList : [] */
                if (Object.keys(result).length > 0) {
                    const rows = makeWorkRequestListRows(result);

                    params = { columns, rows, totList: result };
                } else {
                    params = { columns, rows: [], totList: [] };
                }

                const historyTime = setTimeout(() => {
                    history("/workRequest/workRequestFormList");
                    // history("/workRequest/workRequestFormList", { state: params });
                    clearTimeout(historyTime);
                }, 700);

                /* 성공적으로 제출 후 요청목록 페이지로 이동해서 작성된 리스트 확인할 수 있도록 이동 + 데이터 가져가기 */
                /* 각 단계에 맞는 사용자로 로그인 했을 경우 승인/권한부여 버튼 노출되도록 처리 필요할듯 */
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleFirewallSubmit = async () => {
        if (
            Number(selectedTemplate || "0") === 0 ||
            Number(selectedTemplate || "99") === 99
        ) {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "요청양식은 필수 입니다",
            });

            !!workRequestFormRef.selectedTemplateRef.current &&
                workRequestFormRef.selectedTemplateRef.current.focus();
            return;
        }

        if ((title || "") === "") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "제목은 필수 입니다",
            });

            !!workRequestFormRef.titleRef.current &&
                workRequestFormRef.titleRef.current.focus();
            return;
        }

        if ((selectedApproval || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "승인 담당자는 필수 입니다",
            });

            !!workRequestFormRef.approval.current &&
                workRequestFormRef.approval.current.focus();
            return;
        }

        if ((selectedReviewer || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "정책 검토 담당자는 필수 입니다",
            });

            !!workRequestFormRef.reviewerRef.current &&
                workRequestFormRef.reviewerRef.current.focus();
            return;
        }

        if ((selectedFirewall || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "방화벽 설정 담당자는 필수 입니다",
            });

            !!workRequestFormRef.firewallRef.current &&
                workRequestFormRef.firewallRef.current.focus();
            return;
        }

        await doSubmit();
    };

    const handleSubmit = async () => {
        /* 요청양식 필수값 체크 */
        if (
            Number(selectedTemplate || "0") === 0 ||
            Number(selectedTemplate || "99") === 99
        ) {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "요청양식은 필수 입니다",
            });

            !!workRequestFormRef.selectedTemplateRef.current &&
                workRequestFormRef.selectedTemplateRef.current.focus();
            return;
        }

        if ((title || "") === "") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "제목은 필수 입니다",
            });

            !!workRequestFormRef.titleRef.current &&
                workRequestFormRef.titleRef.current.focus();
            return;
        }

        if ((selectedUser || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "승인 담당자는 필수 입니다",
            });

            !!workRequestFormRef.userRef.current &&
                workRequestFormRef.userRef.current.focus();
            return;
        }

        if ((selectedManager || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "처리 담당자 선택은 필수 입니다",
            });
            !!workRequestFormRef.managerRef.current &&
                workRequestFormRef.managerRef.current.focus();
            return;
        }

        if ((selectedGiveUser || "99") === "99") {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "부여대상 사용자는 필수 입니다",
            });

            !!workRequestFormRef.giveUserRef.current &&
                workRequestFormRef.giveUserRef.current.focus();
            return;
        }

        if (String(selectedWantDate || "").length !== 10) {
            setAlertFlag({
                ...AlertFlag,
                showError: !AlertFlag.showError,
                message: "처리희망일을 oooo-oo-oo 양식으로 입력해주세요.",
            });

            !!workRequestFormRef.wantDateRef.current &&
                workRequestFormRef.wantDateRef.current.focus();
            return;
        }

        await doSubmit();

        //setActiveStep(activeStep + 1);
    };

    /* 로그인한 유저가 승인/권한 처리 담당자인지 체크 */
    const goApprovStep = () => {
        let result;
        const approvButton = (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="승인하기">
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleApprove}
                    >
                        승인하기
                    </Button>
                </Tooltip>
            </Box>
        );

        let assignee = undefined;

        if (Object.keys(location.state || {}).length > 0) {
            const splitedAssignee = (
                location.state.totList.steps[0].assignee || ""
            ).split(",");
            assignee = splitedAssignee[1];
        }

        if (
            Object.keys(location.state || {}).length > 0 &&
            assignee === localStorage.getItem("login-user")
        ) {
            result = approvButton;
        }

        if (
            Object.keys(location.state || {}).length <= 0 ||
            location.state.currentStepKey !== "APPROVAL_REQUESTED"
        ) {
            result = <></>;
        }

        return result;
    };

    /* 권한처리 스탭일 */
    const goProgressStep = (currentStepAssignee) => {
        let result;
        const loginUser = localStorage.getItem("login-user");

        const approvButton = (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="권한 부여">
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleProgress}
                    >
                        권한 부여
                    </Button>
                </Tooltip>
            </Box>
        );

        if (
            (currentStepAssignee || "") !== "" &&
            currentStepAssignee === loginUser
        ) {
            result = approvButton;
        } else if (Object.keys(location.state || {}).length > 0) {
            const splitedAssignee = (
                location.state.totList.steps[1]["assignee"] || ""
            ).split(",");

            result = splitedAssignee[1] === loginUser ? approvButton : <></>;
        }

        if (
            Object.keys(location.state || {}).length <= 0 ||
            location.state.currentStepKey !== "IN_PROGRESS" ||
            activeStep === 2
        ) {
            result = <></>;
        }

        return result;
    };

    /* 방화벽 승인 담당자 일치여부 */
    const goFirewallApprovStep = () => {
        let result;

        const approvButton = (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="승인처리">
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleFirewallApprov}
                    >
                        승인처리
                    </Button>
                </Tooltip>
            </Box>
        );

        let assignee = undefined;

        if (Object.keys(location.state || {}).length > 0) {
            const splitedAssignee = (
                location.state.totList.steps[0].assignee || ""
            ).split(",");
            assignee = splitedAssignee[1];
        }

        if (
            Object.keys(location.state || {}).length > 0 &&
            assignee === localStorage.getItem("login-user")
        ) {
            result = approvButton;
        }

        if (
            Object.keys(location.state || {}).length <= 0 ||
            location.state.currentStepKey !== "APPROVAL_REQUESTED"
        ) {
            result = <></>;
        }

        return result;
    };

    /* 방화벽 정책 검토 담당자 일치여부 */
    const goFirewallReviewerStep = (currentStepAssignee) => {
        let result;
        const loginUser = localStorage.getItem("login-user");

        const approvButton = (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="정책 검토">
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleFirewallProgress}
                    >
                        정책 검토
                    </Button>
                </Tooltip>
            </Box>
        );

        if (
            (currentStepAssignee || "") !== "" &&
            currentStepAssignee === loginUser
        ) {
            result = approvButton;
        } else if (Object.keys(location.state || {}).length > 0) {
            const splitedAssignee = (
                location.state.totList.steps[1]["assignee"] || ""
            ).split(",");

            result = splitedAssignee[1] === loginUser ? approvButton : <></>;
        }

        if (
            Object.keys(location.state || {}).length <= 0 ||
            location.state.currentStepKey !== "CHECKING_POLICY" ||
            activeStep === 2
        ) {
            result = <></>;
        }

        return result;
    };

    /* 방화벽 설정 담당자 */
    const goFirewallStep = (currentStepAssignee) => {
        let result;
        const loginUser = localStorage.getItem("login-user");

        const approvButton = (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="방화벽 설정">
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleFirewall}
                    >
                        방화벽 설정
                    </Button>
                </Tooltip>
            </Box>
        );

        if (
            (currentStepAssignee || "") !== "" &&
            currentStepAssignee === loginUser
        ) {
            result = approvButton;
        } else if (Object.keys(location.state || {}).length > 0) {
            const splitedAssignee = (
                location.state.totList.steps[2]["assignee"] || ""
            ).split(",");

            result = splitedAssignee[1] === loginUser ? approvButton : <></>;
        }

        if (
            Object.keys(location.state || {}).length <= 0 ||
            location.state.currentStepKey !== "SETTING" ||
            activeStep !== 2
        ) {
            result = <></>;
        }

        return result;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Header
                pages={pages}
                handleNavMenu={handleNavMenu}
                selectedTemplate={selectedTemplate}
                activeStep={activeStep}
                buttonFunctions={{
                    goApprovStep,
                    goProgressStep,
                    goFirewallApprovStep,
                    goFirewallReviewerStep,
                    goFirewallStep,
                }}
            />
            <Container
                component="main"
                sx={{ mb: 15 }}
                style={{ float: "left" }}
            >
                <Grid container spacing={3}>
                    <Paper
                        variant="outlined"
                        sx={{ my: { xs: 2, md: 5 }, p: { xs: 2, md: 3 } }}
                    >
                        <Typography variant="h5" color="inherit" noWrap>
                            요청양식
                        </Typography>
                        <CustomDropdownList
                            fullWidth
                            TemplateList={templateList}
                            placeText={"요청 양식을 선택해주세요"}
                            mSize={1}
                            callback={callbackTemplate}
                            dropdownRef={workRequestFormRef.selectedTemplateRef}
                            flag={"template"}
                            isLocationed={location.state}
                        />
                        <br></br>
                        <Typography variant="h5" color="inherit" noWrap>
                            요청제목
                        </Typography>
                        <CustomInput
                            fullWidth
                            inputRef={workRequestFormRef.titleRef}
                            callback={callbackTitle}
                            isLocationed={location}
                            placeText={"제목을 입력하세요"}
                        />
                        <br></br>
                        <Typography variant="h5" color="inherit" noWrap>
                            담당자 설정
                        </Typography>
                        {Number(selectedTemplate || "1") === 1 ||
                        Number(selectedTemplate || "1") === 99 ? (
                            <Stepper
                                activeStep={activeStep}
                                sx={{ pt: 3, pb: 5 }}
                            >
                                {permissionSteps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <br></br>
                                        {index !==
                                            permissionSteps.length - 1 && (
                                            <CustomDropdownList
                                                size={170}
                                                TemplateList={userList}
                                                // TemplateList={index === 0 ? userList: []}
                                                placeText={
                                                    index === 0
                                                        ? "승인 담당자 선택"
                                                        : "처리 담당자 선택"
                                                }
                                                mSize={0}
                                                callback={
                                                    index === 0
                                                        ? callbackUser
                                                        : callbackManager
                                                }
                                                dropdownRef={
                                                    index === 0
                                                        ? workRequestFormRef.userRef
                                                        : workRequestFormRef.managerRef
                                                }
                                                flag={
                                                    index === 0
                                                        ? "assignee"
                                                        : "operator"
                                                }
                                                isLocationed={location.state}
                                                //isDisabled={index === 0 ? false: true}
                                            />
                                        )}
                                    </Step>
                                ))}
                            </Stepper>
                        ) : (
                            <Stepper
                                activeStep={activeStep}
                                sx={{ pt: 3, pb: 5 }}
                            >
                                {firewallSteps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <br></br>
                                        {index !== firewallSteps.length - 1 && (
                                            <CustomDropdownList
                                                size={220}
                                                TemplateList={userList}
                                                placeText={
                                                    index === 0
                                                        ? "승인담당자 선택"
                                                        : index === 1
                                                        ? "정책검토 담당자 선택"
                                                        : index === 2
                                                        ? "방화벽 설정 담당자 선택"
                                                        : ""
                                                }
                                                mSize={0}
                                                callback={
                                                    index === 0
                                                        ? callbackApprovUser
                                                        : index === 1
                                                        ? callbackReviewer
                                                        : index === 2
                                                        ? callbackFirewall
                                                        : callbackApprovUser
                                                }
                                                dropdownRef={
                                                    index === 0
                                                        ? workRequestFormRef.approvalRef
                                                        : index === 1
                                                        ? workRequestFormRef.reviewerRef
                                                        : index === 2
                                                        ? workRequestFormRef.firewallRef
                                                        : workRequestFormRef.approvalRef
                                                }
                                                flag={
                                                    index === 0
                                                        ? "approve"
                                                        : index === 1
                                                        ? "reviewer"
                                                        : index === 2
                                                        ? "firewall"
                                                        : "approve"
                                                }
                                                isLocationed={location.state}
                                                reqType={"firewall"}
                                            />
                                        )}
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                        <>
                            {Number(selectedTemplate || "99") === 1 ||
                            Number(selectedTemplate || "99") === 99 ? (
                                <AddressForm
                                    userInfo={{
                                        userList,
                                        callback: callbackGiveUser,
                                        dropdownRef:
                                            workRequestFormRef.giveUserRef,
                                    }}
                                    reqDetailInfo={{
                                        callback: callbackDetails,
                                    }}
                                    callbackWantDate={callbackWantDate}
                                    wantDateRef={workRequestFormRef.wantDateRef}
                                    isLocationed={JSON.parse(
                                        JSON.stringify(location.state || {})
                                    )}
                                />
                            ) : (
                                <FirewallForm
                                    destinationInfo={{
                                        callback: callbackDestination,
                                        destinationRef:
                                            workRequestFormRef.destinationRef,
                                    }}
                                    sourceInfo={{
                                        callback: callbackSource,
                                        sourceRef: workRequestFormRef.sourceRef,
                                    }}
                                    isLocationed={JSON.parse(
                                        JSON.stringify(location.state || {})
                                    )}
                                />
                            )}
                            {/* {getStepContent(activeStep)} */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                {Object.keys(location.state || {}).length <=
                                    0 && (
                                    <Button
                                        variant="contained"
                                        onClick={
                                            Number(selectedTemplate || "1") ===
                                            1
                                                ? handleSubmit
                                                : handleFirewallSubmit
                                        }
                                        size={"large"}
                                    >
                                        {" "}
                                        요청서 제출
                                    </Button>
                                )}
                            </Box>
                        </>
                    </Paper>
                </Grid>
            </Container>
            {AlertFlag.showError && (
                <CustomSnackbar
                    showYn={AlertFlag.showError}
                    bankgroudColor={AlertFlag.backgroundColor || "orange"}
                    fontColor={"white"}
                    message={AlertFlag.message}
                    callback={handleCloseSnackbar}
                />
            )}
        </ThemeProvider>
    );
}
