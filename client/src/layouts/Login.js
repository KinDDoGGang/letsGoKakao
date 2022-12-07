import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logo from "../assets/images/illustrations/pattern-tree.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { callApi, callAuthApi } from "../utils/utils";
import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";

/* material */
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

/** 로그인 페이지 */
export default function Login() {
  const userNameRef = useRef();
  const history = useNavigate();
  /* TODO 여기 snackbar settimeout cleartimeout 해줘야함 */
  let timeoutSnackbar = undefined;
  const [UserName, setUserName] = useState("");
  const [AlertFlag, setAlertFlag] = React.useState({
    message: "",
    showError: false,
  });

  const [Password, setPassword] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleCloseSnackbar = () => {
    /** clearTimeout 어디서할지 찾아봐야함 */
    timeoutSnackbar = setTimeout(() => {
      setAlertFlag({
        ...AlertFlag,
        showError: !AlertFlag.showError,
      });
      /* 아이디 혹은 틀렸을 때, 아이디에 포커스가 이동되도록 수정 */
      !!userNameRef.current && userNameRef.current.focus();
    }, 1000);
  };

  const joinKeyHandler = (e) => {
    e.preventDefault();
    console.log("e >> event key", e);
  };

  const joinHandler = async (e) => {
    e.preventDefault();

    const data = {
      username: UserName,
      password: Password.password,
    };
    try {
      const result = await callApi("http://127.0.0.1:8080/login", data);

      /* 오류발생 시 예외처리 */
      if (result.status !== 200) {
        setAlertFlag({
          ...AlertFlag,
          showError: !AlertFlag.showError,
          message: result.message || "",
        });
      } else {
        const username = result.username || "";
        const token = result.token || "";

        localStorage.setItem("login-token", token);
        localStorage.setItem("login-user", username);

        axios.defaults.headers.common["Authorization"] = username + " " + token;

        history("/workRequest");
        // history("/workRequest", {state : {templates:templates}});
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("LoginPage render ...");
  }, []);

  const onUserNameHandler = (e) => {
    setUserName(e.currentTarget.value);
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...Password,
      showPassword: !Password.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onPasswordHandler = (prop) => (event) => {
    setPassword({ ...Password, [prop]: event.target.value });
  };

  return (
    <>
      <TitleWrap>
        <img
          style={{ width: "48px", height: "50px", margin: "18px 10px 15px 0" }}
          src={Logo}
          id="Logo"
          alt="Logo"
        />
        <NameWrap>
          카카오페이 사내 업무 요청 시스템
          <br />
        </NameWrap>
      </TitleWrap>
      <LoginWrap>
        <Form>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl sx={{ m: 1, width: "20ch" }} variant="standard">
              <InputLabel htmlFor="component-error">사용자명</InputLabel>
              <Input
                id="component-error"
                value={UserName}
                onChange={onUserNameHandler}
                aria-describedby="component-error-text"
                autoFocus
                inputRef={userNameRef}
              />
              <FormHelperText id="component-error-text"></FormHelperText>
            </FormControl>
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl sx={{ m: 1, width: "20ch" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                비밀번호
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={Password.showPassword ? "text" : "password"}
                value={Password.password}
                onChange={onPasswordHandler("password")}
                onKeyPress={(e) => {
                  if (e.key == "Enter") {
                    joinHandler(e);
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {Password.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <input type="hidden" onKeyDown={joinKeyHandler} />
          <Button
            style={{
              width: "290px",
              textDecoration: "none",
              backgroundColor: "#FFC314",
              color: "black",
              padding: "12px 0",
              borderRadius: "40px",
              margin: "40px 50px 0 50px",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
            className="loginBtn"
            type="button"
            onClick={joinHandler}
          >
            로그인
          </Button>
        </Form>
      </LoginWrap>
      {/* <LinkWrap to="/start">
        <ButtonWrap>카카오페이 홈페이지</ButtonWrap>
      </LinkWrap> */}

      {AlertFlag.showError && (
        <CustomSnackbar
          showYn={AlertFlag.showError}
          bankgroudColor={"orange"}
          fontColor={"white"}
          message={AlertFlag.message}
          callback={handleCloseSnackbar}
        />

        // <Snackbar
        //   open={AlertFlag.showError}
        //   onClose={handleCloseSnackbar()}
        //   TransitionComponent={Slide}
        //   message={AlertFlag.message}
        //   sx={{ height: "30%" }}
        //   anchorOrigin={{
        //     vertical: "bottom",
        //     horizontal: "center",
        //   }}
        //   ContentProps={{
        //     sx: {
        //       background: "orange",
        //       color: "white",
        //       fontWeight: "bold",
        //     },
        //   }}
        // />
      )}
    </>
  );
}

const LoginWrap = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const LinkWrap = styled(Link)`
  width: 290px;
  text-decoration: none;
`;

const LoginButtonWrap = styled.button`
  width: 290px;
  text-decoration: none;
  background-color: #ffc314;
  color: black;
  padding: 12px 0;
  border-radius: 40px;
  margin: 40px 50px 0 50px;
  display: flex;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
`;

const ButtonWrap = styled.div`
  background-color: white;
  color: #c4c4c4;
  padding: 5px 0;
  margin-top: 10px;
  text-decoration: underline;
  text-align: center;
  font-weight: bold;
  font-size: 15px;
`;

const TitleWrap = styled.div`
  margin-top: 130px;
  display: flex;
  justify-content: center;
`;

const NameWrap = styled.p`
  text-shadow: 1px 1px 2px #493e3e;
  font-size: 36px;
  font-weight: bold;
  margin: 18px 0 10px 0;
  color: #ffc314;
`;
