import React from "react";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";

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
