import React, { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { callAuthApi } from "../utils/utils";

const theme = createTheme();

export default function WorkRequestFormList() {
  const { workRequestList } = useOutletContext();
  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    console.log("workRequestList >> ", workRequestList);
    console.log("location data", location);
  }, []);

  const selectUserList =  () => {
    const token = localStorage.getItem("login-token") || "";
    const result =  callAuthApi(
      "http://127.0.0.1:8080/api/usernames",
      "GET",
      {},
      token
    );
    return result;
  };


  /* TODO 여기 cell 클릭 했을 때, data 뿌려주면서 상세화면으로 이동필요, 상세화면일 경우에는 승인 버튼도 존재할 수 있음 */
  const onCellClick = async (GridCellParams, e, callback) => {
    console.log("GridCellParams", GridCellParams);

    const userList = await selectUserList();
    const copiedGridCellParams = JSON.parse(JSON.stringify(GridCellParams));
    const regex = /[^0-9]/g;
    
    const targetUsername = (copiedGridCellParams["row"]['totList']['data']['targetUsername'] || '' );
    const assignee = copiedGridCellParams["row"]['totList']['steps'][0]['assignee'];
    const operator = copiedGridCellParams["row"]['totList']['steps'][1]['assignee'];

    const targetUsernameIndex = userList.indexOf(targetUsername);
    const assigneeIndex = userList.indexOf(assignee);
    const operatorIndex = userList.indexOf(operator);

    if ( targetUsername.replace(regex, "") === '' ) {
        copiedGridCellParams["row"]['totList']['data']['targetUsername'] = `${targetUsernameIndex+1},${targetUsername}`;
        copiedGridCellParams["row"]['totList']['steps'][0]['assignee'] = `${assigneeIndex+1},${assignee}`;
        copiedGridCellParams["row"]['totList']['steps'][1]['assignee'] = `${operatorIndex+1},${operator}`;
    }

    console.log('copiedGridCell', copiedGridCellParams);

    history("/workRequest/workRequestForm", {
      state: copiedGridCellParams["row"],
      isDisabled: true,
    });
  };

  // 깊은복사 [workRequestList 객체는 redux 객체여서 변경 불가]
  const myWorkRequestList = JSON.parse(JSON.stringify(workRequestList));

  const [pageSize, setPageSize] = React.useState(25);
  let rowsData = (myWorkRequestList || { rows: [] }).rows;

  if (Object.keys(location.state || {}).length > 0 && rowsData.length > 0) {
    let locationRow = location.state.rows;
    let rowData = {
      id: locationRow["id"],
      title: locationRow["title"] || "",
      requestedBy: locationRow["requestedBy"],
      date: locationRow["date"],
      totList: locationRow.totList,
    };

    myWorkRequestList["rows"].push(rowData);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            홈 이미지 / 요청 목록
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mb: 15 }} style={{ float: "left" }}>
        <Grid container spacing={3}>
          <Paper
            variant="outlined"
            style={{ width: "100%", height: "700px" }}
            sx={{ my: { xs: 15, md: 5 }, p: { xs: 2, md: 3 } }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <DataGrid
                pageSize={pageSize}
                onPageSizeChange={(newPage) => setPageSize(newPage)}
                pagination
                rows={myWorkRequestList["rows"]}
                columns={myWorkRequestList["columns"]}
                onCellClick={onCellClick}
              />
            </div>
          </Paper>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
