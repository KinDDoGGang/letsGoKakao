import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";
import CustomDropdownList from "../components/CustomDropdownList/CustomDropdownList";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomLogout from "../components/CustomLogout/CustomLogout";

import AddressForm from "../layouts/AddresForm";

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

  const { templateList, userList } = useOutletContext();

  const [AlertFlag, setAlertFlag] = useState({
    message: "",
    showError: false,
    backgroundColor: "",
  });

  const pages = ["Products", "Pricing", "Blog"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  /**여기서부터 MUI */
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSnackbar = () => {
    /** clearTimeout 어디서할지 찾아봐야함 */
    timeoutSnackbar = setTimeout(() => {
      setAlertFlag({
        ...AlertFlag,
        showError: !AlertFlag.showError,
      });
      // !!selectedTemplateRef.current && selectedTemplateRef.current.focus();
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
    console.log("callbackTitle", callbackTitle);
    setTitle(callbackTitle);
  };

  // 승인 담당자 콜백
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

  const callbackDetails = (callbackDetails) => {
    console.log("callbackDetails", callbackDetails);
    setSelectedDetails(callbackDetails);
  };

  // 처리희망일자 콜백
  const callbackWantDate = (callbackWantDate) => {
    console.log("callbackWantDate", callbackWantDate);
    setSelectedWantDate(callbackWantDate);
  };

  useEffect(() => {
    console.log("요청하기 페이지 load...");
  }, []);

  const doSubmit = async () => {
    const param = {
      templateId: selectedTemplateId,
      title: title,
      assignees: [
        `${selectedUser},${selectedUserName}`,
        `${selectedManager},${selectedManagerName}`,
      ],
      data: {
        targetUsername: `${selectedGiveUser},${selectedGiveUserName}`,
        details: selectedDetails,
        date: selectedWantDate,
      },
    };

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
        const columns = makeWorkRequestListColumn();

        setAlertFlag({
          ...AlertFlag,
          showError: !AlertFlag.showError,
          backgroundColor: "#1565c0",
          message: "요청서를 성공적으로 제출하였습니다.",
        });

        console.log("result 데이터 뭘까", result);

        /* 아무것도 없을 때 noRows >> rows: [], totList : [] */
        if (Object.keys(result).length > 0) {
          const rows = makeWorkRequestListRows(result);

          params = { columns, rows, totList: result };
        } else {
          params = { columns, rows: [], totList: [] };
        }

        const historyTime = setTimeout(() => {
          history("/workRequest/workRequestFormList", { state: params });
          clearTimeout(historyTime);
        }, 700);

        /* 성공적으로 제출 후 요청목록 페이지로 이동해서 작성된 리스트 확인할 수 있도록 이동 + 데이터 가져가기 */
        /* 각 단계에 맞는 사용자로 로그인 했을 경우 승인/권한부여 버튼 노출되도록 처리 필요할듯 */
      }
    } catch (e) {
      console.error(e);
    }
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

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const matchLocationData = () => {
    const myLocation = JSON.parse(JSON.stringify(location));
  };

  return (
    <ThemeProvider theme={theme}>
      {matchLocationData()}
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ mb: 15 }} style={{ float: "left" }}>
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
            />
            <br></br>
            <Typography variant="h5" color="inherit" noWrap>
              담당자 설정
            </Typography>
            {Number(selectedTemplate || "1") === 1 ||
            Number(selectedTemplate || "1") === 99 ? (
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {permissionSteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <br></br>
                    {index !== permissionSteps.length - 1 && (
                      <CustomDropdownList
                        size={170}
                        TemplateList={userList}
                        // TemplateList={index === 0 ? userList: []}
                        placeText={
                          index === 0 ? "승인 담당자 선택" : "처리 담당자 선택"
                        }
                        mSize={0}
                        callback={index === 0 ? callbackUser : callbackManager}
                        dropdownRef={
                          index === 0
                            ? workRequestFormRef.userRef
                            : workRequestFormRef.managerRef
                        }
                        flag={index === 0 ? "assignee" : "operator"}
                        isLocationed={location.state}
                        //isDisabled={index === 0 ? false: true}
                      />
                    )}
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {firewallSteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    {index !== firewallSteps.length - 1 && (
                      <CustomDropdownList
                        size={150}
                        TemplateList={[]}
                        placeText={"처리담당자 선택"}
                        mSize={0}
                        callback={callbackManager}
                        dropdownRef={workRequestFormRef.managerRef}
                      />
                    )}
                  </Step>
                ))}
              </Stepper>
            )}
            {/* 마지막 단계 */}
            {activeStep === permissionSteps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </>
            ) : (
              <>
                <AddressForm
                  userInfo={{
                    userList,
                    callback: callbackGiveUser,
                    dropdownRef: workRequestFormRef.giveUserRef,
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
                {/* {getStepContent(activeStep)} */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {Object.keys(location.state || {}).length <= 0 && (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {activeStep === permissionSteps.length - 1
                        ? "Place order"
                        : "요청서 제출"}
                    </Button>
                  )}
                </Box>
              </>
            )}
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
