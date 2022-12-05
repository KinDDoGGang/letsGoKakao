import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

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
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";
import CustomDropdownList from "../components/CustomDropdownList/CustomDropdownList";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomLogout from "../components/CustomLogout/CustomLogout";

import AddressForm from "../layouts/AddresForm";

/** TODO 시간되면 상단에 로그인한 사용자명 표시해줘도 좋을 듯, 로그아웃버튼 추가하고 */

/* step 밑에 dropdownbox 추가 */
const permissionSteps = ["승인 요청", "처리 중", "처리 완료"];
const firewallSteps = ["승인 요청", "정책 검토", "방화벽 설정", "설정 완료"];

/* TODO 여기 snackbar settimeout cleartimeout 해줘야함 */
let timeoutSnackbar = undefined;

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
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
  const selectedTemplateRef = useRef();
  const titleRef = useRef();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("99");
  const [selectedUser, setSelectedUser] = useState("1");

  const [title, setTitle] = useState("");
  const { templateList, userList } = useOutletContext();

  const [AlertFlag, setAlertFlag] = useState({
    message: "",
    showError: false,
  });

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

  const callbackTemplate = (callbackTemplate) => {
    console.log("callbackTemplate >> ", callbackTemplate);
    setSelectedTemplate(callbackTemplate);
  };

  const callbackUser = (callbackUser) => {
    console.log("callbackUSer", callbackUser);
    setSelectedUser(callbackUser);
  };

  const callbackTitle = (callbackTitle) => {
    console.log("callbackTitle", callbackTitle);
    setTitle(callbackTitle);
  };

  useEffect(() => {
    console.log("요청하기 페이지 load...");
  }, []);

  const handleSubmit = () => {
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

      !!selectedTemplateRef.current && selectedTemplateRef.current.focus();
      return;
    }

    if ((title || "") === "") {
      setAlertFlag({
        ...AlertFlag,
        showError: !AlertFlag.showError,
        message: "제목은 필수 입니다",
      });

      !!titleRef.current && titleRef.current.focus();
      return;
    }

    //setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            홈 이미지 / 요청 하기 <CustomLogout />
          </Typography>
        </Toolbar>
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
              dropdownRef={selectedTemplateRef}
            />
            <br></br>
            <Typography variant="h5" color="inherit" noWrap>
              요청제목
            </Typography>
            <CustomInput
              fullWidth
              inputRef={titleRef}
              callback={callbackTitle}
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
                        size={150}
                        TemplateList={userList}
                        placeText={"담당자 선택"}
                        mSize={0}
                        callback={callbackUser}
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
                        TemplateList={userList}
                        placeText={"담당자 선택"}
                        mSize={0}
                        callback={callbackUser}
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
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === permissionSteps.length - 1
                      ? "Place order"
                      : "요청서 제출"}
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Container>
      {AlertFlag.showError && (
        <CustomSnackbar
          showYn={AlertFlag.showError}
          bankgroudColor={"orange"}
          fontColor={"white"}
          message={AlertFlag.message}
          callback={handleCloseSnackbar}
        />
      )}
    </ThemeProvider>
  );
}
