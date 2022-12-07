import React from "react";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";

/* 공통으로 사용하는 Snackbar 하단에서 알람 메세지 노출 */
export default function CustomSnackbar({
    showYn,
    bankgroudColor,
    fontColor,
    message,
    callback,
}) {
    return (
        <Snackbar
            open={showYn}
            onClose={callback()}
            TransitionComponent={Slide}
            message={message}
            sx={{ height: "30%" }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            ContentProps={{
                sx: {
                    background: bankgroudColor || "orange",
                    color: fontColor || "white",
                    fontWeight: "bold",
                    fontSize: "100%",
                },
            }}
        />
    );
}
