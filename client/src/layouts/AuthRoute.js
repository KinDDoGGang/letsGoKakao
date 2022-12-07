import React from "react";
import { Route, Routes, Navigate,Outlet } from "react-router-dom";
import { isLogin } from "../utils/utils";
import WorkRequest from "./WorkRequest";
/**
 * 로그인 사용자에 따라 분기 처리 필요할 경우 AuthRoute 안에 파라미터에 구분값 추가로 받아야함
 * 
 */
export default function AuthRoute({ path }) {
  console.log("patth>>", path);

  return (
       <>
       <Routes>
          <Route
            exact={`${true}`}
            path={ isLogin() ? path : "*"}
            element={ isLogin() ? <WorkRequest /> : <Navigate to="/" /> }
          />
      </Routes>
      <Outlet />
      </>
    );
}