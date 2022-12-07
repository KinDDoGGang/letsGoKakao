import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomDropdownList from "../components/CustomDropdownList/CustomDropdownList";
import CustomDatePicker from "../components/CustomDatePicker/CustomDatePicker";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getToday } from "../utils/utils";

export default function AddressForm({
  userInfo,
  reqDetailInfo,
  callbackWantDate,
  wantDateRef,
  isLocationed,
}) {
  const [reqDetails, setReqDetails] = useState("");

  // const makeLocationedData = () => {
  //   let locationedDetail, locationedDate;
  //   if (Object.keys(isLocationed) > 0) {
  //     locationedDetail = locationedObj["details"];
  //     locationedDate = locationedObj["date"];

  //     setReqDetails(locationedDetail);
  //   }

  //   return {
  //     locationedDetail,
  //     locationedDate,
  //   };
  // };

  console.log("locationedData in addressForm", isLocationed);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={13}>
          <Typography variant="h5" gutterBottom>
            부여대상 사용자
          </Typography>
          <CustomDropdownList
            fullWidth
            TemplateList={userInfo.userList}
            placeText={"부여대상 사용자 선택"}
            mSize={1}
            callback={userInfo.callback}
            dropdownRef={userInfo.dropdownRef}
            flag={"giveUser"}
            isLocationed={isLocationed}
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: "30px" }}>
          <Typography variant="h5" gutterBottom>
            요청 내용 상세
          </Typography>
          <CKEditor
            editor={ClassicEditor}
            config={{ placeholder: "상세 내용 입력해주세요." }}
            disabled={Object.keys(isLocationed).length > 0}
            data={
              Object.keys(isLocationed).length > 0
                ? isLocationed["totList"]["data"]["details"]
                : reqDetails
            }
            onReady={(editor) => {
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setReqDetails(data);
              reqDetailInfo.callback(data);
            }}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: "30px" }}>
          <Typography variant="h6" gutterBottom>
            처리 희망일
          </Typography>
          <CustomDatePicker
            callback={callbackWantDate}
            wantDateRef={wantDateRef}
            isLocationed={isLocationed || {}}
          />
        </Grid>
      </Grid>
    </>
  );
}
