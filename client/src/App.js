import React, { useState } from 'react';

import {
    BrowserRouter as Router, 
    Outlet, 
    Route, 
    Routes, 
    Link, 
    Navigate, 
    NavLink, 
    useParams
} from 'react-router-dom';
import './App.css';

import Login from './layouts/Login';
import NotFound from './layouts/NotFound';
import WorkRequest from './layouts/WorkRequest';
import Start from './layouts/Start';
import AppLayout from './layouts/AppLayout';
import Blank from './layouts/Blank';
import WorkRequestForm from './layouts/WorkRequestForm';
import WorkRequestFormList from './layouts/WorkRequestFormList';


import AuthRoute from './layouts/AuthRoute';

import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

var contents = [
    {id : 1, title:'HTML', description:'HTML is ...'},
    {id : 2, title:'JS', description:'JS is ...'},
    {id : 3, title:'React', description:'React is ...'},
]

function Topic(){
    var params = useParams();
    var topic_id = params.topic_id;
    // 기본값
    var selected_topic = {
        title:'Sorry',
        description:'Not Found'    
    };

    for(var i=0; i<contents.length; i++){
        if(contents[i].id === Number(topic_id)){
            selected_topic = contents[i];
            break;
        }
    }
    return (
        <div>
            <h3>{selected_topic.title}</h3>
            {selected_topic.description}
        </div>
    );
}

function Topics(){
    var lis = [];
    for(var i=0; i<contents.length; i++) {
        lis.push(<li key={contents[i].id}><NavLink to={'/topics/'+contents[i].id}>{contents[i].title}</NavLink></li>)
    }
    return (
        <div>
            <h2>요청상세정보</h2>
            <ul>
                {lis}
            </ul>
            <Outlet />
        </div>
    )
}

export default function App(){
  const IS_LOGIN = localStorage.getItem("login-token");

  return(
        <div>
            <Routes>
              <Route exact={`${true}`} path="/" element={<Login />} />
                <Route path="/topics" element={<Topics />} >
                  <Route path=":topic_id" element={<Topic/>} />
                </Route>
                <Route
                  exact={`${true}`}
                  path={ !!IS_LOGIN ? "/workRequest/*" : "*"}
                  element={ !!IS_LOGIN ? <WorkRequest /> : <Navigate to="/" /> }
                > 
                    <Route path="workRequestForm" element={<WorkRequestForm />} />
                    <Route path='workRequestFormList' element={<WorkRequestFormList />} />
                </Route>
                <Route path="/start" element={<Start />} />
                <Route path="*" element={<NotFound />} /> 
            </Routes>
        </div>
  );
}