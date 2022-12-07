import React from 'react';

import { Outlet } from "react-router-dom";
import Sidebar from "../components/CustomSidebar/CustomSidebar";

export default function  AppLayout({ templateList, userList, workRequestList }) {
    return <div style={{
        padding: '50px 0px 0px 370px'
    }}>
        <Sidebar />
        <Outlet 
            context={{ 
                templateList: templateList
                , userList : userList 
                , workRequestList : workRequestList
            }}
        />
        {/* { pathSize === 2 && <h2>업무를 선택해주세요 라는 빈페이지 안내문구 필요</h2> } */}
    </div>;
};
