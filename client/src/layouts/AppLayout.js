import React from 'react';

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function  AppLayout({ templateList, userList, workRequestList }) {
    const pathSize = (window.location.pathname.split('/') || [] ).length;
    console.log('pathSize', pathSize);
    console.log('userList', userList);
    console.log('templateList', templateList);

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
