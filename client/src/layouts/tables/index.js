/* eslint-disable prefer-template */
/* eslint-disable radix */
/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
/* eslint-disable-next-line no-unused-vars */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
  Coded by www.creative-tim.com
 =========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState } from 'react';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDPagination from "components/MDPagination";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// eslint-disable-next-line no-unused-vars
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

// inputBox
import MDInput from "components/MDInput";
import Modal from './popup/Modal';


// eslint-disable-next-line import/order
// import Pagination from '@mui/material/Pagination';

// dropdownList css
import "./css/dropdown.css";

function Tables() {
  const pageActive = 'MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root page1 css-1gwitrb-MuiButtonBase-root-MuiButton-root';
  // eslint-disable-next-line no-unused-vars
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData(); /* eslint-disable-line no-unused-vars */
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("보험대차모바일 차세대지원 프로젝트");
  const [requester, setRequester] = useState("장지인");
  const [reqDept, setReqDept] = useState("DCX팀");

  const [validateRequester, setValidRequester] = useState('data');
  const [validateReqDept, setValidReqDept] = useState('data');

  // 프로젝트 지원 시간 입력란 추가
  const [timeCheckYn, setTimeCheckYn] = useState('N');
  const [supportTime, setSupportTime] = useState(1);

  const rightFloat = {float:'right'};

  const sendWorkReport = e => {
    e.preventDefault();
    setModalOpen(true);
  }

  // 팝업창 닫힐 때, 초기화
  const closeModal = () => {
    setModalOpen(false);
    setTimeCheckYn('');
  };

  // 등록하기 버튼 클릭 시 > validationCheck
  const callbackModal = () => {
    
    // 등록하기 버튼 클릭 시 요청자 필수값 체크
    if ( (requester || '' ) === '' ) {
      setValidRequester('');
    } else {
      setValidRequester(requester);
    }

    // 등록하기 버튼 클릭 시 요청부서 필수값 체크
    if ( (reqDept || '') === '' ) {
      setValidReqDept('');
    } else {
      setValidReqDept(reqDept);
    }
  }

  // 제목 변경 시 Evt
  const changeTitle = e => {
    e.preventDefault();
    setTitle(e.target.value);
  }

  // 요청자 변경 시
  const changeRequester = e => {
    e.preventDefault();
    setRequester(e.target.value);
    setValidRequester(e.target.value);
  }

  // 요청부서 변경 시
  const changeReqDept = e => {
    e.preventDefault();
    setReqDept(e.target.value);
    setValidReqDept(e.target.value);
  }

  // 업무구분 선택 시
  const changeWorkType = e => {
    e.preventDefault();
    
    if ( String(e.target.value || '') === '2' || String(e.target.value || '') === '3') {
      setTimeCheckYn('Y');
    } else {
      setTimeCheckYn('N');
    }
    
  }

  // 프로젝트 지원 시간 변경 시
  const changeSupportTime = e => {
    e.preventDefault();
    setSupportTime(e.target.value);
  }


  const goNextPage = e => {
    e.preventDefault();
    const activeTextarea = document.activeElement;
    
    if ( (activeTextarea || '') !== '') {
      alert('다음 페이지 없음');
      return;
    }

    document.getElementById(activeTextarea.id).className = pageActive;
  }

  const makePaging = () => {
    // const pageArr = [];
    // if (rows.length / 8 >= 1) {
    //   const pageLength = Number.parseInt(rows.length / 8);
      
    //   for (let idx=0; idx < pageLength; idx++) {
    //     pageArr.push(
    //       <Pagination count={10} color="primary" />
    //     )
    //   }
    // }
    // return [...pageArr];
  }

  // eslint-disable-next-line arrow-body-style
  const showData = () => {
    return (
      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />
    )
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <div >
                  <div  style={{ paddingBottom: '-4px;', float:'left' }}>
                    <MDTypography variant="h6" color="white">
                      업무보고
                    </MDTypography>
                  </div>
                  <div style={rightFloat}>
                    <MDButton onClick={sendWorkReport} >업무보고</MDButton>
                  </div>
                </div>

              </MDBox>
              <MDBox pt={3}>

              <div id="pageControl">
                <MDPagination id="pageOuter" count={10}>
                  <MDPagination item onClick={goNextPage}>
                    <Icon>keyboard_arrow_left</Icon>
                  </MDPagination>
                  <div id="makePaging">
                    <MDPagination onClick={goNextPage} className="page1" id="page1" item active>1</MDPagination>
                    { makePaging() }
                  </div>
                    <MDPagination onClick={goNextPage} item> 
                    <Icon>keyboard_arrow_right</Icon>
                    </MDPagination>
                </MDPagination>
              </div>
                {showData()}
              </MDBox>
            </Card>
          </Grid>

          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  차세대프로젝트
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}

        </Grid>
      </MDBox>
      <Footer />

      <Modal 
        open={modalOpen}
        close={closeModal}
        header="업무등록"
        callback={callbackModal}
      >
        <div>
          업무구분
          <div style={{float:'right', padding:'2px'}} >
            {/* eslint-disable-next-line react/no-unknown-property */}
            <div className="selectBox">
              <select name="fruits" className="select" onChange={changeWorkType}>
                <option disabled selected>업무구분</option>
                <option value="1">개발/운영</option>
                <option value="2">차세대프로젝트</option>
                <option value="3">프로젝트지원</option>
              </select>
              <span className="icoArrow"><img src="https://freepikpsd.com/media/2019/10/down-arrow-icon-png-7-Transparent-Images.png" alt="" /></span>
            </div>
          </div>
          <div>&nbsp;</div>
          <div>
            제목 <span style={rightFloat}><MDInput id="title" style={{width:'16em'}} onChange={changeTitle} type="text" value={title}/> </span>
          </div>
          <div>&nbsp;</div>
          <div>
            등록일 <span style={rightFloat}><MDInput type="date" label="Date" value="2018-11-23" size="small"/> </span>
          </div>
          <div>&nbsp;</div>
          <div>
            마감일자 <span style={rightFloat}><MDInput type="date" label="Date" value="2018-11-23" size="small"/> </span>
          </div>
          <div>&nbsp;</div>
          <div>
            요청자 
            {
              ( validateRequester || '' ) !== '' 
            ?
              <span style={rightFloat}><MDInput id="requester" type="text" success value={requester} onChange={changeRequester} /> </span>
            :
              <span style={rightFloat}><MDInput id="requester" type="text" error value={requester} onChange={changeRequester} /> </span>
            }
          </div>
          <div>&nbsp;</div>
          <div>
          요청부서
            {
              (validateReqDept || '') !== ''
              ?
                <span style={rightFloat}><MDInput id="reqDept" type="text" success value={reqDept} onChange={changeReqDept} /> </span>
              :
                <span style={rightFloat}><MDInput id="reqDept" type="text" error value={reqDept} onChange={changeReqDept} /> </span>
            }
          </div>
          <div>&nbsp;</div>
          <div>
            내용 <span style={rightFloat}><MDInput style={{ width:'17em'}} type="text" size="large" multiline rows={5} /> </span>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>

            {
              timeCheckYn === 'Y'
              && <>지원시간<span style={rightFloat}><MDInput id="supportTime" type="number" success value={supportTime} onChange={changeSupportTime} /> </span></>
            }

        </div>

      </Modal>

    </DashboardLayout>
  );
}

export default Tables;
