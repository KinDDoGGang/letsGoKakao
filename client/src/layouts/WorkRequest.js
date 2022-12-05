import React, {useState, useEffect} from 'react';

import './WorkRequest.css';
import 'boxicons/css/boxicons.min.css';
import AppLayout from '../layouts/AppLayout';
import{useLocation} from 'react-router-dom';
import {callApi, callAuthApi, makeDate} from '../utils/utils';


/**
 * 사내 업무요청 화면 Header
 */
export default function WorkRequest() {
    const [TemplateList, setTemplateList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const [WorkRequestList, setWorkRequestList] = useState(
        { columns: [], rows: [], totList : [] }
    );

    const selectTemplateList = async () => {
        const token = localStorage.getItem('login-token') || '';
        const result = await callAuthApi("http://127.0.0.1:8080/api/templates", "GET", {}, token);
        setTemplateList(result);
    }

    const selectUserList = async () => {
        const token = localStorage.getItem('login-token') || '';
        const result = await callAuthApi("http://127.0.0.1:8080/api/usernames", "GET", {}, token);
        setUserList(result);
    }

    const selectWorkRequestList = async () => {
        const token = localStorage.getItem('login-token') || '';
        const result = await callAuthApi("http://127.0.0.1:8080/api/requests", "GET", {}, token);
        
        console.log('result workRequestList >>', result)

        const columns = makeWorkRequestListColumn();

        /* 아무것도 없을 때 noRows */
        if ( (result['content'] || [] ).length > 0 ){
            const rows = makeWorkRequestListRows(result['content']);
            console.log('result rows', rows);
    
            setWorkRequestList({ columns, rows, totList: result});
        } else {
            setWorkRequestList({ columns, rows: [], totList : []});
        }
    };

    const makeWorkRequestListColumn = () => {
        const result = [
            { field: "id", headerName: "요청ID", flex: 1, },
            { field: "title", headerName: "제목", flex: 1 },
            { field: "requestedBy", headerName: "작성자", flex: 1 },
            { field: "date", headerName: "작성일시", flex: 1 },
            { field: "totList", headerName: "", flex: 1, hide: true },
        ];

        return result;
    }

    const makeWorkRequestListRows = (workRequestList) => {
        return workRequestList.map( (v, i) => {
            return {
                id : v['id']
                , title : v['title'] || ''
                , requestedBy : v['requestedBy']
                , date : makeDate(new Date(v['createdAt']))
                , totList : v
            }    
        })
    }

    useEffect(  () => {
         selectTemplateList();
         selectUserList();
         selectWorkRequestList();
    },[]);
    // const location = useLocation();
    // console.log('location in header', location)
    return(
       <AppLayout 
            templateList={TemplateList}
            userList={UserList}
            workRequestList={WorkRequestList}
       /> 
    )
}