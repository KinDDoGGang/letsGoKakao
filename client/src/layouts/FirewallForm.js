import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomDatePicker from "../components/CustomDatePicker/CustomDatePicker";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getToday } from "../utils/utils";

export default function FirewallForm({
    destinationInfo,
    sourceInfo,
    isLocationed,
}) {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={13}>
                    <Typography variant="h5" gutterBottom>
                        출발지IP
                    </Typography>
                    <CustomInput
                        fullWidth
                        inputRef={destinationInfo.destinationRef}
                        callback={destinationInfo.callback}
                        isLocationed={isLocationed}
                        placeText={"출발지 주소를 입력하세요"}
                        flag={"destination"}
                    />
                </Grid>
                <Grid item xs={12} sm={13}>
                    <Typography variant="h5" gutterBottom>
                        도착지IP
                    </Typography>
                    <CustomInput
                        fullWidth
                        inputRef={sourceInfo.sourceRef}
                        callback={sourceInfo.callback}
                        isLocationed={isLocationed}
                        placeText={"도착지 주소를 입력하세요"}
                        flag={"source"}
                    />
                </Grid>
            </Grid>
        </>
    );
}
