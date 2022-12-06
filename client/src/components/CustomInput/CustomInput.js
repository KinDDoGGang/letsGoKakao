import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function CustomInput({
  fullWidth,
  inputRef,
  callback,
  isLocationed,
}) {
  const [title, setTitle] = useState("");
  let locationedTitle = "";
  const handleChange = (event) => {
    setTitle(event.target.value);
    callback(event.target.value);
  };

  useEffect(() => {
    if (Object.keys(isLocationed.state || {}).length > 0) {
      locationedTitle = isLocationed.state.title;
      setTitle(locationedTitle);
      callback(locationedTitle);
    }
  }, []);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="제목을 입력하세요"
        variant="outlined"
        inputRef={inputRef}
        onChange={handleChange}
        value={locationedTitle || title}
        disabled={Object.keys(isLocationed.state || {}).length > 0}
      />
    </Box>
  );
}
