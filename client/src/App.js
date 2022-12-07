import React from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import "./css/App.css";

import Login from "./layouts/Login";
import NotFound from "./layouts/NotFound";
import WorkRequest from "./layouts/WorkRequest";

import WorkRequestForm from "./layouts/WorkRequestForm";
import WorkRequestFormList from "./layouts/WorkRequestFormList";

export default function App() {
    const IS_LOGIN = localStorage.getItem("login-token");

    return (
        <div>
            <Routes>
                <Route exact={`${true}`} path="/" element={<Login />} />
                <Route
                    exact={`${true}`}
                    path={!!IS_LOGIN ? "/workRequest/*" : "*"}
                    element={!!IS_LOGIN ? <WorkRequest /> : <Navigate to="/" />}
                >
                    <Route
                        path="workRequestForm"
                        element={<WorkRequestForm />}
                    />
                    <Route
                        path="workRequestFormList"
                        element={<WorkRequestFormList />}
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
