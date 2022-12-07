import React, { useState, useEffect } from "react";

import "./WorkRequest.css";
import "boxicons/css/boxicons.min.css";
import AppLayout from "../layouts/AppLayout";
// import { useLocation } from "react-router-dom";
import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";

import { useNavigate } from "react-router-dom";

import {
  callApi,
  callAuthApi,
  makeDate,
  makeWorkRequestListColumn,
  makeWorkRequestListRows,
} from "../utils/utils";

/**
 * 사내 업무요청 화면 Header
 */
export default function WorkRequest() {
  const history = useNavigate();

  const [TemplateList, setTemplateList] = useState([]);
  const [UserList, setUserList] = useState([]);
  const [AlertFlag, setAlertFlag] = useState({
    message: "",
    showError: false,
    backgroundColor: "",
  });

  const [WorkRequestList, setWorkRequestList] = useState({
    columns: [],
    rows: [],
    totList: [],
  });

  const handleCloseSnackbar = () => {
    /** clearTimeout 어디서할지 찾아봐야함 */
    setTimeout(() => {
      setAlertFlag({
        ...AlertFlag,
        showError: !AlertFlag.showError,
      });
    }, 1300);
  };

  const selectTemplateList = async () => {
    const token = localStorage.getItem("login-token") || "";
    const result = await callAuthApi(
      "http://127.0.0.1:8080/api/templates",
      "GET",
      {},
      token
    );

    // 권한이 없거나 로그인 세션이 끊겼을 경우 로그인 페이지로 이동
    if (result.status === 401 && !Array.isArray(result)) {
      setAlertFlag({
        ...AlertFlag,
        showError: !AlertFlag.showError,
        message: result.message || "통신 중 오류가 발생하였습니다.",
      });
      setTimeout(() => {
        history("/");
      }, 1000);
    }
    setTemplateList(result);
  };

  const selectUserList = async () => {
    const token = localStorage.getItem("login-token") || "";
    const result = await callAuthApi(
      "http://127.0.0.1:8080/api/usernames",
      "GET",
      {},
      token
    );
    setUserList(result);
  };

  const selectWorkRequestList = async () => {
    const token = localStorage.getItem("login-token") || "";
    const result = await callAuthApi(
      "http://127.0.0.1:8080/api/requests",
      "GET",
      {},
      token
    );

    console.log("result workRequestList >>", result);

    const columns = makeWorkRequestListColumn();

    /* 아무것도 없을 때 noRows */
    if ((result["content"] || []).length > 0) {
      const rows = makeWorkRequestListRows(result["content"]);
      console.log("result rows", rows);

      setWorkRequestList({ columns, rows, totList: result });
    } else {
      setWorkRequestList({ columns, rows: [], totList: [] });
    }
  };

  useEffect(() => {
    try {
      selectTemplateList();
      selectUserList();
      selectWorkRequestList();
    } catch (e) {
      console.error(e);
    }
  }, []);
  // const location = useLocation();
  // console.log('location in header', location)
  return (
    <>
      <AppLayout
        templateList={TemplateList}
        userList={UserList}
        workRequestList={WorkRequestList}
      />

      {AlertFlag.showError && (
        <CustomSnackbar
          showYn={AlertFlag.showError}
          bankgroudColor={AlertFlag.backgroundColor || "orange"}
          fontColor={"white"}
          message={AlertFlag.message}
          callback={handleCloseSnackbar}
        />
      )}
    </>
  );
}
