import React from 'react';

import {
    Outlet, 
    Route, 
    Routes, 
    Navigate, 
    NavLink, 
    useParams
} from 'react-router-dom';
import './css/App.css';

import Login from './layouts/Login';
import NotFound from './layouts/NotFound';
import WorkRequest from './layouts/WorkRequest';

import WorkRequestForm from './layouts/WorkRequestForm';
import WorkRequestFormList from './layouts/WorkRequestFormList';

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
                <Route path="*" element={<NotFound />} /> 
            </Routes>
        </div>
  );
}